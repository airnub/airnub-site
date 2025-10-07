#!/usr/bin/env tsx
import { ChildProcess, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http, { type IncomingHttpHeaders } from 'node:http';
import https from 'node:https';
import { JSDOM } from 'jsdom';
import { AIRNUB_BASE_URL } from '../apps/airnub/lib/routes';
import { SPECKIT_BASE_URL } from '../apps/speckit/lib/routes';
import { ADF_BASE_URL } from '../apps/adf/lib/routes';

type AppKey = 'airnub' | 'speckit' | 'adf';
type AppConfig = { key: AppKey; port: number; routes: string[]; start: string };
type AppState = {
  config: AppConfig;
  present: boolean;
  dir: string;
  child?: ChildProcess;
  mode?: 'start' | 'dev';
  ready: boolean;
};
type AppStates = Record<AppKey, AppState>;

const APPS: AppConfig[] = [
  {
    key: 'airnub',
    port: 3101,
    routes: ['/', '/work', '/projects', '/about', '/contact', '/privacy', '/robots.txt', '/sitemap.xml', '/opengraph-image'],
    start: '/',
  },
  {
    key: 'speckit',
    port: 3102,
    routes: ['/', '/quickstart', '/privacy', '/robots.txt', '/sitemap.xml', '/opengraph-image'],
    start: '/',
  },
  {
    key: 'adf',
    port: 3103,
    routes: ['/', '/quickstart', '/privacy', '/robots.txt', '/sitemap.xml', '/opengraph-image'],
    start: '/',
  },
];

const CANONICAL_ORIGINS: Record<AppKey, string> = {
  airnub: AIRNUB_BASE_URL,
  speckit: SPECKIT_BASE_URL,
  adf: ADF_BASE_URL,
};

const REQUIRED_SITEMAP_PATHS: Record<AppKey, string[]> = {
  airnub: ['/', '/work', '/projects', '/about', '/contact'],
  speckit: ['/', '/quickstart'],
  adf: ['/', '/quickstart'],
};

const exists = (p: string) => fs.existsSync(p);
const ensureDir = (dir: string) => {
  if (!exists(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

type FetchResponse = {
  status: number;
  ctype: string;
  html?: string;
  finalUrl: string;
  redirects: string[];
};

type RawFetchResponse = {
  status: number;
  ctype: string;
  html: string;
  headers: IncomingHttpHeaders;
};

const REDIRECT_STATUS_CODES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 3;

function requestOnce(url: string, timeoutMs: number): Promise<RawFetchResponse> {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const client = target.protocol === 'https:' ? https : http;
    const req = client.get(target, (res) => {
      const bufs: Buffer[] = [];
      res.on('data', (chunk) => bufs.push(Buffer.from(chunk)));
      res.on('end', () => {
        const body = Buffer.concat(bufs).toString('utf8');
        resolve({
          status: res.statusCode ?? 0,
          ctype: String(res.headers['content-type'] ?? ''),
          html: body,
          headers: res.headers,
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')));
  });
}

async function get(url: string, timeoutMs = 8000): Promise<FetchResponse> {
  let currentUrl = url;
  const redirects: string[] = [];

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const res = await requestOnce(currentUrl, timeoutMs);
    const status = res.status;
    const location = res.headers.location;
    const isRedirect = typeof location === 'string' && REDIRECT_STATUS_CODES.has(status);

    if (isRedirect) {
      if (redirects.length >= MAX_REDIRECTS) {
        throw new Error(`Too many redirects for ${url}`);
      }
      const nextUrl = new URL(location, currentUrl).toString();
      redirects.push(nextUrl);
      currentUrl = nextUrl;
      continue;
    }

    return {
      status,
      ctype: res.ctype,
      html: res.html,
      finalUrl: currentUrl,
      redirects,
    };
  }

  throw new Error(`Redirect loop detected for ${url}`);
}

function normalizePathname(pathname: string): string {
  if (!pathname) {
    return '/';
  }
  let value = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (value.length > 1 && value.endsWith('/')) {
    value = value.replace(/\/+/g, '/');
    while (value.length > 1 && value.endsWith('/')) {
      value = value.slice(0, -1);
    }
    if (!value) {
      value = '/';
    }
  }
  return value;
}

function isLocalePrefixedMatch(pathname: string, required: string): boolean {
  const localeMatch = pathname.match(/^\/[a-z]{2}(?:-[A-Z]{2})?(\/.*)?$/);
  if (!localeMatch) {
    return false;
  }
  const remainder = localeMatch[1] ?? '';
  const remainderPath = remainder ? normalizePathname(remainder) : '/';
  return remainderPath === normalizePathname(required);
}

function extractSitemapLocs(xml: string): string[] {
  try {
    const dom = new JSDOM(xml, { contentType: 'text/xml' });
    return Array.from(dom.window.document.querySelectorAll('loc'))
      .map((node) => (node.textContent ?? '').trim())
      .filter(Boolean);
  } catch (error) {
    const matches = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/gi));
    return matches.map((match) => match[1]?.trim() ?? '').filter(Boolean);
  }
}

function validateSitemap(app: AppKey, xml: string): { missing: string[]; locs: string[] } {
  const locs = extractSitemapLocs(xml);
  const pathnames = new Set<string>();

  for (const loc of locs) {
    try {
      const parsed = new URL(loc);
      pathnames.add(normalizePathname(parsed.pathname));
    } catch (error) {
      // ignore malformed URLs
    }
  }

  const required = REQUIRED_SITEMAP_PATHS[app] ?? [];
  const missing = required.filter((requiredPath) => {
    const normalized = normalizePathname(requiredPath);
    if (pathnames.has(normalized)) {
      return false;
    }
    return !Array.from(pathnames).some((pathname) => isLocalePrefixedMatch(pathname, normalized));
  });

  return { missing, locs };
}

function hasRobotsSitemap(app: AppKey, body: string): boolean {
  const origin = CANONICAL_ORIGINS[app];
  if (!origin) {
    return false;
  }
  const expected = `sitemap: ${new URL('/sitemap.xml', origin).toString()}`.toLowerCase();
  return body.toLowerCase().includes(expected);
}

function logFile(path: string, content: string) {
  ensureDir('artifacts');
  fs.writeFileSync(path, content, 'utf8');
}

function run(cmd: string, args: string[], opts: { cwd?: string; env?: NodeJS.ProcessEnv; tee?: string } = {}): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd,
      env: opts.env ?? process.env,
      stdio: opts.tee ? 'pipe' : 'inherit',
    });
    if (!opts.tee) {
      child.on('close', (code) => resolve(code ?? 0));
      return;
    }
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => {
      const text = String(chunk);
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr?.on('data', (chunk) => {
      const text = String(chunk);
      stderr += text;
      process.stderr.write(text);
    });
    child.on('close', (code) => {
      logFile(opts.tee!, stdout + (stderr ? `\n${stderr}` : ''));
      resolve(code ?? 0);
    });
  });
}

async function ensureBuild(): Promise<{ built: boolean }> {
  ensureDir('artifacts');
  const buildLog = 'artifacts/build.log';
  const retryLog = 'artifacts/build.retry.log';
  const fixLog = 'artifacts/next-intl-fix.log';

  const exit = await run('pnpm', ['-w', 'build'], { tee: buildLog });
  if (exit === 0) {
    return { built: true };
  }

  let buildOutput = '';
  if (exists(buildLog)) {
    buildOutput = fs.readFileSync(buildLog, 'utf8');
  }
  const missingNextIntl = /next-intl\/server/i.test(buildOutput);
  if (missingNextIntl) {
    const why = spawnSync('pnpm', ['why', 'next-intl'], { encoding: 'utf8' });
    const hasNextIntl = why.status === 0 && /next-intl@/i.test(why.stdout);
    if (!hasNextIntl) {
      await run('pnpm', ['-w', 'add', 'next-intl@^3', '-D'], { tee: fixLog });
    }
    const retry = await run('pnpm', ['-w', 'build'], { tee: retryLog });
    if (retry === 0) {
      return { built: true };
    }
  }

  return { built: false };
}

async function waitReady(url: string, tries = 25, delayMs = 500) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await get(url, 2000);
      if (res.status >= 200 && res.status < 500) {
        return true;
      }
    } catch (error) {
      // ignore network errors during boot
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

async function startApps(built: boolean): Promise<AppStates> {
  const states = {} as AppStates;
  for (const config of APPS) {
    const dir = `apps/${config.key}`;
    const present = exists(`${dir}/app`) || exists(`${dir}/pages`);
    const state: AppState = { config, present, dir, ready: false };
    states[config.key] = state;
    if (!present) {
      continue;
    }

    const hasBuild = exists(`${dir}/.next`);
    const useStart = built && hasBuild;
    state.mode = useStart ? 'start' : 'dev';
    const args = ['--filter', `./apps/${config.key}`, 'exec', 'next', state.mode, '-p', String(config.port)];
    const child = spawn('pnpm', args, {
      stdio: 'inherit',
      env: { ...process.env, DISABLE_PWA: process.env.DISABLE_PWA ?? '1' },
    });
    state.child = child;
    state.ready = await waitReady(`http://localhost:${config.port}/`);
  }
  return states;
}

async function stopChild(child: ChildProcess) {
  await new Promise<void>((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(forceKill);
      resolve();
    };
    const forceKill = setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
      }
    }, 2000);
    child.once('exit', finish);
    child.once('close', finish);
    if (!child.kill('SIGTERM')) {
      finish();
    }
  });
}

async function stopApps(states: AppStates) {
  await Promise.all(
    Object.values(states).map(async (state) => {
      if (state.child) {
        await stopChild(state.child);
      }
    }),
  );
}

async function smoke(states: AppStates, built: boolean) {
  const report: any = {
    build: built ? 'pass' : 'fail',
    apps: {} as Record<string, any>,
    outstanding: [] as { priority: number; title: string }[],
  };

  for (const config of APPS) {
    const state = states[config.key];
    const entry: any = {
      present: state?.present ?? false,
      mode: state?.mode ?? null,
      port: config.port,
      boot: 'skipped',
      routes: {} as Record<string, any>,
    };
    report.apps[config.key] = entry;
    if (!state?.present) {
      continue;
    }
    entry.boot = state.ready ? 'pass' : 'fail';
    for (const route of config.routes) {
      if (!state.ready) {
        entry.routes[route] = { status: 0 };
        continue;
      }
      try {
        const res = await get(`http://localhost:${config.port}${route}`);
        const routeResult: Record<string, any> = {
          status: res.status,
          ctype: res.ctype,
          finalUrl: res.finalUrl,
          redirected: res.redirects.length > 0,
          redirects: res.redirects,
        };
        entry.routes[route] = routeResult;
        const expectedStatusOverride = route === '/404' ? 404 : null;
        const isExpectedStatus = expectedStatusOverride !== null && res.status === expectedStatusOverride;
        if (isExpectedStatus) {
          routeResult.expectedStatus = expectedStatusOverride;
          routeResult.notes = ['expected 404'];
        }
        if (!isExpectedStatus && (res.status < 200 || res.status >= 400)) {
          report.outstanding.push({ priority: 2, title: `${config.key} ${route} status ${res.status}` });
        }
        if (route === '/robots.txt' && !res.ctype.includes('text')) {
          report.outstanding.push({ priority: 3, title: `${config.key} robots content-type` });
        }
        if (route === '/sitemap.xml' && !res.ctype.includes('xml')) {
          report.outstanding.push({ priority: 3, title: `${config.key} sitemap content-type` });
        }
        if (route === '/opengraph-image' && !res.ctype.startsWith('image')) {
          report.outstanding.push({ priority: 2, title: `${config.key} OG content-type` });
        }
        if (route === '/sitemap.xml' && res.html) {
          const sitemap = validateSitemap(config.key, res.html);
          routeResult.sitemap = sitemap;
          if (sitemap.missing.length) {
            sitemap.missing.forEach((missingPath) => {
              report.outstanding.push({ priority: 1, title: `${config.key} sitemap missing ${missingPath}` });
            });
          }
        }
        if (route === '/robots.txt' && res.html) {
          const robotsCheck = hasRobotsSitemap(config.key, res.html);
          routeResult.robots = { hasSitemap: robotsCheck };
          if (!robotsCheck) {
            report.outstanding.push({
              priority: 2,
              title: `${config.key} robots missing sitemap line`,
            });
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        entry.routes[route] = { status: 0, error: message };
        report.outstanding.push({ priority: 2, title: `${config.key} ${route} unreachable` });
      }
    }
  }

  report.outstanding.sort((a: any, b: any) => {
    if (a.priority === b.priority) {
      return a.title.localeCompare(b.title);
    }
    return a.priority - b.priority;
  });

  const md: string[] = ['# Airnub Site — Smoke Report', '', `- Build: ${built ? '✅ pass' : '❌ fail'}`, ''];
  for (const config of APPS) {
    const entry = report.apps[config.key];
    md.push(`## apps/${config.key}`);
    md.push(`- Present: ${entry.present ? '✅' : '❌'}`);
    if (!entry.present) {
      md.push('');
      continue;
    }
    if (entry.mode) {
      md.push(`- Mode: ${entry.mode}`);
    }
    md.push(`- Boot: ${entry.boot === 'pass' ? '✅' : '❌'}`);
    md.push('- Routes:');
    for (const [route, result] of Object.entries(entry.routes)) {
      const value = result as {
        status: number;
        ctype?: string;
        error?: string;
        finalUrl?: string;
        redirected?: boolean;
        sitemap?: { missing: string[]; locs: string[] };
        robots?: { hasSitemap: boolean };
        notes?: string[];
      };
      const baseDetail = value.error ? `error: ${value.error}` : `${value.status} ${value.ctype ?? ''}`.trim();
      const notes: string[] = [];
      if (value.sitemap?.missing?.length) {
        notes.push(`missing: ${value.sitemap.missing.join(', ')}`);
      }
      if (value.robots && value.robots.hasSitemap === false) {
        notes.push('missing sitemap line');
      }
      if (value.notes?.length) {
        notes.push(...value.notes);
      }
      const detail = notes.length ? `${baseDetail} (${notes.join('; ')})` : baseDetail;
      const label = value.redirected && value.finalUrl ? `${route} → ${value.finalUrl}` : route;
      md.push(`  - ${label}: ${detail}`);
    }
    md.push('');
  }
  if (report.outstanding.length) {
    md.push('## Outstanding (prioritised)');
    report.outstanding.forEach((item: any, index: number) => {
      md.push(`${index + 1}) [P${item.priority}] ${item.title}`);
    });
  } else {
    md.push('## Outstanding');
    md.push('None 🎉');
  }
  fs.writeFileSync('SMOKE-REPORT.md', md.join('\n') + '\n', 'utf8');
  fs.writeFileSync('SMOKE-REPORT.json', JSON.stringify(report, null, 2) + '\n', 'utf8');
}

async function linkcheck(states: AppStates) {
  const results: Record<AppKey, string[]> = { airnub: [], speckit: [], adf: [] };

  for (const config of APPS) {
    const state = states[config.key];
    if (!state?.present) {
      results[config.key] = ['app not present'];
      continue;
    }
    if (!state.ready) {
      results[config.key] = ['server not ready'];
      continue;
    }

    const base = `http://localhost:${config.port}`;
    const queue: Array<{ url: string; depth: number }> = [{
      url: new URL(config.start, base).toString(),
      depth: 0,
    }];
    const seen = new Set<string>();
    const broken: string[] = [];

    while (queue.length) {
      const current = queue.shift()!;
      if (seen.has(current.url)) {
        continue;
      }
      seen.add(current.url);
      if (current.depth > 2) {
        continue;
      }
      try {
        const res = await get(current.url);
        if (res.status >= 400 && res.status !== 429) {
          broken.push(`${current.url} → ${res.status}`);
          continue;
        }
        if (current.depth >= 2) {
          continue;
        }
        const dom = new JSDOM(res.html ?? '');
        const links = Array.from(dom.window.document.querySelectorAll('a[href]'));
        for (const link of links) {
          const rawHref = (link.getAttribute('href') ?? '').trim();
          if (!rawHref) continue;
          if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) continue;
          const normalized = rawHref.split('#')[0];
          if (!normalized) continue;
          let nextUrl: string;
          if (normalized.startsWith('http')) {
            if (!normalized.startsWith(base)) continue;
            nextUrl = normalized;
          } else if (normalized.startsWith('/')) {
            nextUrl = new URL(normalized, base).toString();
          } else {
            const baseUrl = current.url.endsWith('/') ? current.url : `${current.url}/`;
            nextUrl = new URL(normalized, baseUrl).toString();
          }
          if (!seen.has(nextUrl)) {
            queue.push({ url: nextUrl, depth: current.depth + 1 });
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        broken.push(`${current.url} → ${message}`);
      }
    }

    results[config.key] = broken;
  }

  const md: string[] = ['# Link Check', ''];
  for (const config of APPS) {
    const issues = results[config.key];
    md.push(`## ${config.key}`);
    if (!issues.length) {
      md.push('- No broken internal links');
    } else {
      for (const line of issues) {
        md.push(`- ${line}`);
      }
    }
    md.push('');
  }
  fs.writeFileSync('LINK-REPORT.md', md.join('\n').trimEnd() + '\n', 'utf8');
}

let activeStates: AppStates | null = null;
let shuttingDown = false;
async function shutdownAndExit(code: number) {
  if (shuttingDown) {
    process.exit(code);
    return;
  }
  shuttingDown = true;
  if (activeStates) {
    await stopApps(activeStates);
  }
  process.exit(code);
}
process.on('SIGINT', () => {
  void shutdownAndExit(130);
});
process.on('SIGTERM', () => {
  void shutdownAndExit(143);
});

async function main() {
  const args = new Set(process.argv.slice(2));
  const runAll = args.has('--all') || args.size === 0;
  const doSmoke = runAll || args.has('--smoke');
  const doLinks = runAll || args.has('--links');

  if (!doSmoke && !doLinks) {
    console.error('No tasks specified. Use --smoke, --links, or --all.');
    process.exit(1);
  }

  ensureDir('artifacts');
  const { built } = await ensureBuild();
  activeStates = await startApps(built);

  try {
    if (doSmoke) {
      await smoke(activeStates, built);
    }
    if (doLinks) {
      await linkcheck(activeStates);
    }
  } finally {
    if (activeStates) {
      await stopApps(activeStates);
    }
    activeStates = null;
  }
}

main().catch(async (error) => {
  console.error(error);
  if (activeStates) {
    await stopApps(activeStates);
  }
  process.exit(1);
});
