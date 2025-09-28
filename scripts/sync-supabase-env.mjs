#!/usr/bin/env node
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const SOURCE_TO_ENV = new Map([
  ['api.url', 'NEXT_PUBLIC_SUPABASE_URL'],
  ['api.anon_key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  ['api.service_role_key', 'SUPABASE_SERVICE_ROLE_KEY'],
  ['db.password', 'SUPABASE_DB_PASSWORD_LOCAL'],
]);

const TARGET_FILES = [
  '.env.local',
  path.join('apps', 'airnub', '.env.local'),
  path.join('apps', 'speckit', '.env.local'),
];

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

function formatEnvValue(value) {
  if (value === '' || /[^A-Za-z0-9_./:@-]/.test(value)) {
    return JSON.stringify(value);
  }
  return value;
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

async function main() {
  const args = ['status', '-o', 'env'];
  for (const [source, target] of SOURCE_TO_ENV) {
    args.push('--override-name', `${source}=${target}`);
  }

  let envOutput;
  try {
    const { stdout } = await execFileAsync('supabase', args, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    envOutput = stdout;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('[sync-supabase-env] Supabase CLI is not installed or not on PATH.');
    } else {
      console.error('[sync-supabase-env] Failed to run `supabase status`:', error.message || error);
    }
    process.exitCode = 1;
    return;
  }

  const parsed = parseEnvOutput(envOutput);
  const updates = new Map();
  for (const targetKey of SOURCE_TO_ENV.values()) {
    if (parsed.has(targetKey)) {
      updates.set(targetKey, parsed.get(targetKey));
    }
  }

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
