#!/usr/bin/env node
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const TARGET_FILES = [
  '.env.local',
  path.join('apps', 'airnub', '.env.local'),
  path.join('apps', 'speckit', '.env.local'),
];

const HUMAN_LABEL_TO_ENV = new Map([
  ['API URL', 'NEXT_PUBLIC_SUPABASE_URL'],
  ['Publishable key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  ['Secret key', 'SUPABASE_SERVICE_ROLE_KEY'],
  ['Database URL', 'SUPABASE_DB_URL_LOCAL'],
  ['Database Password', 'SUPABASE_DB_PASSWORD_LOCAL'],
  ['S3 Access Key', 'SUPABASE_STORAGE_S3_ACCESS_KEY'],
  ['S3 Secret Key', 'SUPABASE_STORAGE_S3_SECRET_KEY'],
  ['S3 Region', 'SUPABASE_STORAGE_S3_REGION'],
]);

function formatEnvValue(value) {
  if (value === '' || /[^A-Za-z0-9_./:@-]/.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function parseEnvOutput(envText) {
  const result = new Map();
  for (const rawLine of envText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }
    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result.set(key, value);
  }
  return result;
}

function parseHumanReadableStatus(statusText) {
  const result = new Map();
  for (const rawLine of statusText.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      continue;
    }
    const match = trimmed.match(/^([A-Za-z0-9 /_-]+):\s*(.+)$/);
    if (!match) {
      continue;
    }
    const [, label, value] = match;
    if (!HUMAN_LABEL_TO_ENV.has(label)) {
      continue;
    }
    result.set(HUMAN_LABEL_TO_ENV.get(label), value.trim());
  }

  // The status output does not include the password as a standalone field,
  // but the Postgres connection string contains it. If we have the URL,
  // derive the password to keep parity with the previous CLI env output.
  if (!result.has('SUPABASE_DB_PASSWORD_LOCAL') && result.has('SUPABASE_DB_URL_LOCAL')) {
    try {
      const parsed = new URL(result.get('SUPABASE_DB_URL_LOCAL'));
      if (parsed.password) {
        result.set('SUPABASE_DB_PASSWORD_LOCAL', decodeURIComponent(parsed.password));
      }
    } catch (error) {
      console.warn('[sync-supabase-env] Failed to derive DB password from connection string:', error.message || error);
    }
  }

  return result;
}

function parseExistingEnv(content) {
  const lines = content.split(/\r?\n/);
  return lines.map((line) => {
    if (!line.trim()) {
      return { type: 'blank', raw: line };
    }
    if (line.trim().startsWith('#')) {
      return { type: 'comment', raw: line };
    }
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      return { type: 'other', raw: line };
    }
    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1);
    return { type: 'entry', key, value, raw: line };
  });
}

function applyEnvUpdates(originalContent, updates) {
  const lines = parseExistingEnv(originalContent);
  const handledKeys = new Set();
  const updatedLines = lines.map((line) => {
    if (line.type === 'entry' && updates.has(line.key)) {
      handledKeys.add(line.key);
      const value = updates.get(line.key);
      return `${line.key}=${formatEnvValue(value)}`;
    }
    return line.raw;
  });

  const missingKeys = [];
  for (const [key, value] of updates) {
    if (!handledKeys.has(key)) {
      missingKeys.push([key, value]);
    }
  }

  if (missingKeys.length > 0) {
    if (updatedLines.length > 0 && updatedLines[updatedLines.length - 1].trim() !== '') {
      updatedLines.push('');
    }
    updatedLines.push('# Synced from Supabase CLI status');
    for (const [key, value] of missingKeys) {
      updatedLines.push(`${key}=${formatEnvValue(value)}`);
    }
  }

  return `${updatedLines.join('\n')}${updatedLines.length > 0 ? '\n' : ''}`;
}

async function ensureFileUpdated(filePath, updates) {
  try {
    await access(filePath, constants.F_OK);
    const existing = await readFile(filePath, 'utf8');
    const nextContent = applyEnvUpdates(existing, updates);
    await writeFile(filePath, nextContent, 'utf8');
    return { filePath, status: 'updated' };
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    const header = [
      '# Generated Supabase environment variables',
      '# Run `pnpm db:env:local` after `supabase start` to refresh.',
      '',
    ];
    const lines = [];
    for (const [key, value] of updates) {
      lines.push(`${key}=${formatEnvValue(value)}`);
    }
    const content = `${header.concat(lines).join('\n')}\n`;
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, content, 'utf8');
    return { filePath, status: 'created' };
  }
}

let supabaseCliMissing = false;

async function runSupabaseCommand(args) {
  try {
    const { stdout } = await execFileAsync('supabase', args, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return { stdout };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('[sync-supabase-env] Supabase CLI is not installed or not on PATH.');
      supabaseCliMissing = true;
    } else {
      console.error(`[sync-supabase-env] Failed to run \`supabase ${args.join(' ')}\`:
${error.message || error}`);
    }
    return null;
  }
}

async function collectEnvFromSupabase() {
  const attempts = [
    async () => {
      const commandArgs = ['status', '--output', 'env'];
      const result = await runSupabaseCommand(commandArgs);
      if (!result) {
        return null;
      }
      const parsed = parseEnvOutput(result.stdout);
      if (parsed.size === 0) {
        return null;
      }
      return parsed;
    },
    async () => {
      const commandArgs = ['status', '-o', 'env'];
      const result = await runSupabaseCommand(commandArgs);
      if (!result) {
        return null;
      }
      const parsed = parseEnvOutput(result.stdout);
      if (parsed.size === 0) {
        return null;
      }
      return parsed;
    },
    async () => {
      const result = await runSupabaseCommand(['status']);
      if (!result) {
        return null;
      }
      const parsed = parseHumanReadableStatus(result.stdout);
      return parsed.size > 0 ? parsed : null;
    },
  ];

  for (const attempt of attempts) {
    const parsed = await attempt();
    if (parsed) {
      return parsed;
    }
    if (supabaseCliMissing) {
      break;
    }
  }

  return null;
}

async function main() {
  const parsed = await collectEnvFromSupabase();
  if (!parsed) {
    process.exitCode = 1;
    console.error('[sync-supabase-env] Unable to parse Supabase status output.');
    return;
  }

  const updates = parsed;

  const requiredKeys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missingRequired = requiredKeys.filter((key) => !updates.has(key));
  if (missingRequired.length > 0) {
    console.error(
      `[sync-supabase-env] Missing required keys from Supabase status output: ${missingRequired.join(', ')}`,
    );
    process.exitCode = 1;
    return;
  }

  for (const targetFile of TARGET_FILES) {
    try {
      const result = await ensureFileUpdated(targetFile, updates);
      console.log(`[sync-supabase-env] ${result.status === 'created' ? 'Created' : 'Updated'} ${result.filePath}`);
    } catch (error) {
      console.error(`[sync-supabase-env] Failed to update ${targetFile}:`, error.message || error);
      process.exitCode = 1;
    }
  }
}

main();
