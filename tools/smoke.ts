#!/usr/bin/env tsx

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { get } from './http';
import { crawl as crawlLinks } from './link-check';

interface CommandResult {
  code: number;
  stdout: string;
  stderr: string;
}

interface AppConfig {
  key: 'airnub' | 'speckit' | 'adf';
  packageName: string;
  port: number;
  pages: string[];
  seo: { robots: string; sitemap: string };
  ogPath: string;
}

interface RouteSummary {
  status: number;
  contentType: string;
  ok: boolean;
  error?: string;
}

interface ServiceWorkerSummary {
  status: 'pass' | 'warn' | 'fail' | 'skipped';
  details?: string;
  hasServiceWorker: boolean;
  cacheControl?: string;
}

interface AppReport {
  present: boolean;
  boot?: 'pass' | 'fail';
  url?: string;
  routes?: Record<string, RouteSummary>;
  seo?: {
    robots?: RouteSummary;
    sitemap?: RouteSummary;
  };
  og?: RouteSummary;
  sw?: ServiceWorkerSummary;
  env?: Record<string, { status: 'set' | 'missing' | 'invalid'; value?: string }>;
}

interface OutstandingItem {
  priority: number;
  title: string;
  details: string;
  scope: string;
}

interface SmokeReport {
  build: 'pass' | 'fail' | 'skipped';
  typecheck: 'pass' | 'fail' | 'skipped';
  apps: Record<string, AppReport>;
  linkcheck: {
    status: 'pass' | 'fail' | 'skipped';
    broken: Array<{ url: string; status: number; message?: string }>;
  };
  i18n: {
    status: 'pass' | 'fail' | 'skipped';
    output?: string;
  };
  outstanding: OutstandingItem[];
}

const apps: AppConfig[] = [
  {
    key: 'airnub',
    packageName: '@airnub/airnub-app',
    port: 3101,
    pages: ['/', '/work', '/projects', '/about', '/contact'],
    seo: { robots: '/robots.txt', sitemap: '/sitemap.xml' },
    ogPath: '/opengraph-image',
  },
  {
    key: 'speckit',
    packageName: '@airnub/speckit-app',
    port: 3102,
    pages: ['/', '/quickstart'],
    seo: { robots: '/robots.txt', sitemap: '/sitemap.xml' },
    ogPath: '/opengraph-image',
  },
  {
    key: 'adf',
    packageName: '@airnub/adf-app',
    port: 3103,
    pages: ['/', '/quickstart'],
    seo: { robots: '/robots.txt', sitemap: '/sitemap.xml' },
    ogPath: '/opengraph-image',
  },
];

const appEnvRequirements: Record<string, string[]> = {
  airnub: ['NEXT_PUBLIC_SITE_URL'],
  speckit: ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_DOCS_URL_SPECKIT'],
  adf: ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_DOCS_URL_ADF'],
};

const report: SmokeReport = {
  build: 'skipped',
  typecheck: 'skipped',
  apps: {},
  linkcheck: { status: 'skipped', broken: [] },
  i18n: { status: 'skipped' },
  outstanding: [],
};

const childProcesses: Record<string, ReturnType<typeof spawn>> = {};

process.on('SIGINT', () => {
  cleanup();
  process.exit(1);
});

process.on('exit', () => {
  cleanup();
});

(async function main() {
  try {
    await ensureInstall();
    await runBuild();
    await runTypecheck();

    await startApps();
    await probeApps();
    await runLinkCheck();
    await runI18n();

    writeReports();
  } catch (error) {
    console.error(error);
    report.outstanding.push({
      priority: 1,
      title: 'Smoke script crashed',
      details: (error as Error).message,
      scope: 'cross',
    });
    writeReports();
    process.exit(1);
  } finally {
    cleanup();
  }
})();

async function ensureInstall(): Promise<void> {
  console.log('Installing dependencies...');
  const result = await runCommand('pnpm', ['-w', 'install', '--frozen-lockfile']);
  if (result.code !== 0) {
    report.outstanding.push({
      priority: 1,
      title: 'Install failed',
      details: 'pnpm -w install did not complete successfully.',
      scope: 'cross',
    });
  }
}

async function runBuild(): Promise<void> {
  console.log('Building workspace...');
  const result = await runCommand('pnpm', ['-w', 'build']);
  report.build = result.code === 0 ? 'pass' : 'fail';
  if (result.code !== 0) {
    report.outstanding.push({
      priority: 1,
      title: 'Build failed',
      details: 'Resolve build failures reported by pnpm -w build.',
      scope: 'cross',
    });
  }
}

async function runTypecheck(): Promise<void> {
  const pkgPath = path.resolve('package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { scripts?: Record<string, string> };
  if (!pkg.scripts || !pkg.scripts.typecheck) {
    report.typecheck = 'skipped';
    return;
  }

  console.log('Running typecheck...');
  const result = await runCommand('pnpm', ['-w', 'typecheck']);
  report.typecheck = result.code === 0 ? 'pass' : 'fail';
  if (result.code !== 0) {
    report.outstanding.push({
      priority: 1,
      title: 'Typecheck failed',
      details: 'Resolve TypeScript errors reported by pnpm -w typecheck.',
      scope: 'cross',
    });
  }
}

async function startApps(): Promise<void> {
  for (const app of apps) {
    const appDir = path.join('apps', app.key);
    const present = fs.existsSync(appDir);
    report.apps[app.key] = { present };
    if (!present) {
      continue;
    }

    console.log(`Starting ${app.key} on port ${app.port}...`);
    const child = spawn(
      'pnpm',
      ['--filter', app.packageName, 'exec', 'next', 'start', '-p', String(app.port)],
      {
        stdio: 'inherit',
        env: process.env,
      },
    );
    childProcesses[app.key] = child;
    const ready = await waitForReady(`http://localhost:${app.port}/`);
    report.apps[app.key].boot = ready ? 'pass' : 'fail';
    report.apps[app.key].url = `http://localhost:${app.port}`;
    if (!ready) {
      if (!child.killed) {
        child.kill();
      }
      delete childProcesses[app.key];
      report.outstanding.push({
        priority: 1,
        title: `${app.key} failed to start`,
        details: `next start did not respond on port ${app.port}.`,
        scope: app.key,
      });
    }
  }
}

async function probeApps(): Promise<void> {
  for (const app of apps) {
    const summary = report.apps[app.key];
    if (!summary?.present || summary.boot !== 'pass') {
      continue;
    }

    const baseUrl = `http://localhost:${app.port}`;
    summary.routes = {};

    for (const route of app.pages) {
      const result = await probeRoute(baseUrl, route, 200);
      summary.routes[route] = result;
    }

    summary.seo = {};
    summary.seo.robots = await probeRoute(baseUrl, app.seo.robots, 200, (res) => {
      const type = res.contentType.toLowerCase();
      if (!type.includes('text')) {
        report.outstanding.push({
          priority: 3,
          title: `${app.key} robots.txt content-type`,
          details: `Expected text content-type but received "${res.contentType}"`,
          scope: app.key,
        });
      }
    });

    summary.seo.sitemap = await probeRoute(baseUrl, app.seo.sitemap, 200, (res) => {
      const type = res.contentType.toLowerCase();
      if (!type.includes('xml')) {
        report.outstanding.push({
          priority: 3,
          title: `${app.key} sitemap content-type`,
          details: `Expected XML content-type but received "${res.contentType}"`,
          scope: app.key,
        });
      }
    });

    summary.og = await probeRoute(baseUrl, app.ogPath, 200, (res) => {
      if (!res.contentType.startsWith('image')) {
        report.outstanding.push({
          priority: 2,
          title: `${app.key} OG image response`,
          details: `Expected image/* content-type but received "${res.contentType}"`,
          scope: app.key,
        });
      }
    }, 'buffer');

    summary.sw = await checkServiceWorker(baseUrl, app.key);
    summary.env = checkEnv(app.key);
  }
}

async function runLinkCheck(): Promise<void> {
  const appOrder = ['airnub', 'speckit', 'adf'];
  const targetKey = appOrder.find((key) => report.apps[key]?.boot === 'pass');
  if (!targetKey) {
    return;
  }

  const baseUrl = report.apps[targetKey].url;
  if (!baseUrl) {
    return;
  }

  console.log(`Running internal link check on ${targetKey} (${baseUrl})...`);
  try {
    const result = await crawlLinks(baseUrl, { maxDepth: 2, maxPages: 25 });
    report.linkcheck = {
      status: result.broken.length === 0 ? 'pass' : 'fail',
      broken: result.broken,
    };
    if (result.broken.length > 0) {
      for (const finding of result.broken) {
        report.outstanding.push({
          priority: 2,
          title: `Broken link detected: ${finding.url}`,
          details: `Status ${finding.status}${finding.message ? ` — ${finding.message}` : ''}`,
          scope: targetKey,
        });
      }
    }
  } catch (error) {
    report.linkcheck = {
      status: 'fail',
      broken: [{ url: baseUrl, status: 0, message: (error as Error).message }],
    };
    report.outstanding.push({
      priority: 2,
      title: 'Link check failed',
      details: (error as Error).message,
      scope: targetKey,
    });
  }
}

async function runI18n(): Promise<void> {
  const syncScript = path.resolve('tools/i18n-sync.ts');
  if (!fs.existsSync(syncScript)) {
    report.i18n.status = 'skipped';
    return;
  }

  console.log('Running i18n sync...');
  const result = await runCommand('pnpm', ['dlx', 'tsx', 'tools/i18n-sync.ts', '--strict']);
  report.i18n = {
    status: result.code === 0 ? 'pass' : 'fail',
    output: result.stdout + result.stderr,
  };
  if (result.code !== 0) {
    report.outstanding.push({
      priority: 1,
      title: 'i18n sync failed',
      details: 'Resolve issues reported by tools/i18n-sync.ts.',
      scope: 'cross',
    });
  }
}

function checkEnv(appKey: string): Record<string, { status: 'set' | 'missing' | 'invalid'; value?: string }> {
  const envResult: Record<string, { status: 'set' | 'missing' | 'invalid'; value?: string }> = {};
  const required = appEnvRequirements[appKey] ?? [];

  for (const key of required) {
    const value = process.env[key];
    if (!value) {
      envResult[key] = { status: 'missing' };
      report.outstanding.push({
        priority: 2,
        title: `${appKey} env ${key} missing`,
        details: 'Set this environment variable for production deployments.',
        scope: appKey,
      });
      continue;
    }

    if (!/^https?:\/\//i.test(value)) {
      envResult[key] = { status: 'invalid', value };
      report.outstanding.push({
        priority: 3,
        title: `${appKey} env ${key} invalid`,
        details: `Expected URL-like value but received "${value}"`,
        scope: appKey,
      });
      continue;
    }

    envResult[key] = { status: 'set', value };
  }

  return envResult;
}

async function probeRoute(
  baseUrl: string,
  route: string,
  expectedStatus: number,
  after?: (result: RouteSummary) => void,
  responseType: 'text' | 'json' | 'buffer' = 'text',
): Promise<RouteSummary> {
  const url = `${baseUrl}${route}`;
  try {
    const response = await get(url, { responseType, timeoutMs: 8000 });
    const contentType = String(response.headers['content-type'] ?? '');
    const summary: RouteSummary = {
      status: response.status,
      contentType,
      ok: response.status === expectedStatus,
    };

    if (response.status !== expectedStatus) {
      report.outstanding.push({
        priority: 2,
        title: `Unexpected status for ${route}`,
        details: `${url} returned ${response.status}.`,
        scope: inferScopeFromUrl(baseUrl),
      });
    }

    if (after) {
      after(summary);
    }

    return summary;
  } catch (error) {
    report.outstanding.push({
      priority: 2,
      title: `Request failed for ${route}`,
      details: (error as Error).message,
      scope: inferScopeFromUrl(baseUrl),
    });
    return {
      status: 0,
      contentType: '',
      ok: false,
      error: (error as Error).message,
    };
  }
}

async function checkServiceWorker(baseUrl: string, scope: string): Promise<ServiceWorkerSummary> {
  const swUrl = `${baseUrl}/service-worker.js`;
  try {
    const response = await get(swUrl, { responseType: 'text', timeoutMs: 4000 });
    if (response.status >= 200 && response.status < 400) {
      const htmlResponse = await get(baseUrl, { responseType: 'text', timeoutMs: 4000 });
      const cacheControl = String(htmlResponse.headers['cache-control'] ?? '');
      const cacheOk = cacheControl.includes('no-store') || cacheControl.includes('no-cache') || cacheControl.includes('max-age=0');
      if (!cacheOk) {
        report.outstanding.push({
          priority: 3,
          title: `${scope} HTML caching via service worker`,
          details: `Cache-Control header was "${cacheControl || 'missing'}"`,
          scope,
        });
      }

      return {
        status: cacheOk ? 'pass' : 'warn',
        hasServiceWorker: true,
        cacheControl,
        details: cacheOk ? 'Service worker present, HTML responses marked as no-cache.' : 'Service worker present; verify HTML caching strategy.',
      };
    }
  } catch (error) {
    // Ignore fetch errors; treat as not present.
  }

  return {
    status: 'skipped',
    hasServiceWorker: false,
    details: 'No service worker detected.',
  };
}

function waitForReady(url: string, attempts = 40, delayMs = 1000): Promise<boolean> {
  return new Promise((resolve) => {
    let remaining = attempts;
    const attempt = async () => {
      if (remaining <= 0) {
        resolve(false);
        return;
      }

      remaining -= 1;
      try {
        const response = await get(url, { timeoutMs: 1500 });
        if (response.status >= 200 && response.status < 500) {
          resolve(true);
          return;
        }
      } catch (error) {
        // ignore
      }

      setTimeout(attempt, delayMs);
    };

    attempt();
  });
}

function inferScopeFromUrl(baseUrl: string): string {
  for (const app of apps) {
    if (baseUrl.endsWith(String(app.port))) {
      return app.key;
    }
  }
  return 'cross';
}

function writeReports(): void {
  const markdown = buildMarkdown(report);
  const json = JSON.stringify(report, null, 2);
  fs.writeFileSync('SMOKE-REPORT.md', markdown, 'utf8');
  fs.writeFileSync('SMOKE-REPORT.json', json, 'utf8');
  console.log('Smoke report written to SMOKE-REPORT.md and SMOKE-REPORT.json');
}

function buildMarkdown(data: SmokeReport): string {
  const lines: string[] = [];
  lines.push('# Airnub Site — Smoke Report');
  lines.push('');
  lines.push('## Summary');
  lines.push(`- Build: ${formatStatus(data.build)}`);
  lines.push(`- Typecheck: ${formatStatus(data.typecheck)}`);
  const appsSummary = apps
    .map((app) => {
      const info = data.apps[app.key];
      const present = info?.present;
      const symbol = present ? '✓' : '✗';
      return `[${app.key} ${symbol}]`;
    })
    .join(' ');
  lines.push(`- Apps detected: ${appsSummary}`);
  lines.push('');
  lines.push('## Per-app Checks');

  for (const app of apps) {
    const info = data.apps[app.key];
    lines.push(`### apps/${app.key}`);
    if (!info?.present) {
      lines.push('- Present: ❌');
      lines.push('');
      continue;
    }

    const bootStatus = info.boot === 'pass' ? 'PASS' : info.boot === 'fail' ? 'FAIL' : 'SKIPPED';
    const bootLine = info.url ? `${bootStatus} (${info.url})` : bootStatus;
    lines.push(`- Boot: ${bootLine}`);

    if (info.routes) {
      const routeStatus = app.pages
        .map((route) => {
          const result = info.routes?.[route];
          const symbol = result?.ok ? '✓' : '✗';
          return `${route} ${symbol}`;
        })
        .join(', ');
      lines.push(`- Routes: ${routeStatus}`);
    }

    if (info.seo) {
      const robots = info.seo.robots;
      const sitemap = info.seo.sitemap;
      const robotsStatus = robots?.ok ? `✓ (${robots.status})` : robots ? `✗ (${robots.status})` : 'skipped';
      const sitemapStatus = sitemap?.ok ? `✓ (${sitemap.status})` : sitemap ? `✗ (${sitemap.status})` : 'skipped';
      lines.push(`- SEO: ${app.seo.robots} ${robotsStatus}, ${app.seo.sitemap} ${sitemapStatus}`);
    }

    if (info.og) {
      const ogOk = info.og.ok ? '✓' : '✗';
      lines.push(`- OG: ${app.ogPath} ${ogOk} (${info.og.contentType || 'unknown'})`);
    }

    if (info.sw) {
      lines.push(`- SW: ${info.sw.status.toUpperCase()}${info.sw.details ? ` — ${info.sw.details}` : ''}`);
    }

    if (info.env) {
      const envSummary = Object.entries(info.env)
        .map(([key, value]) => {
          const statusSymbol = value.status === 'set' ? '✓' : value.status === 'invalid' ? '⚠️' : '✗';
          if (value.status === 'set' && value.value) {
            return `${key} ${statusSymbol} (${value.value})`;
          }
          return `${key} ${statusSymbol}`;
        })
        .join(', ');
      lines.push(`- Env: ${envSummary || 'None checked'}`);
    }

    lines.push('');
  }

  lines.push('## Cross-cutting');
  if (data.linkcheck.status === 'skipped') {
    lines.push('- Internal link check: SKIPPED');
  } else {
    const linkStatus = data.linkcheck.status === 'pass' ? 'PASS' : 'FAIL';
    const brokenCount = data.linkcheck.broken.length;
    lines.push(`- Internal link check: ${linkStatus} with ${brokenCount} broken links`);
  }

  if (data.i18n.status === 'skipped') {
    lines.push('- i18n: SKIPPED');
  } else {
    lines.push(`- i18n: ${data.i18n.status.toUpperCase()}`);
  }

  lines.push('');
  lines.push('## Outstanding (prioritised)');
  if (data.outstanding.length === 0) {
    lines.push('None 🎉');
  } else {
    const sorted = [...data.outstanding].sort((a, b) => a.priority - b.priority);
    sorted.forEach((item, index) => {
      lines.push(`${index + 1}) [P${item.priority}] ${item.title} — ${item.details}`);
    });
  }

  lines.push('');
  return lines.join('\n');
}

function formatStatus(status: string): string {
  if (status === 'pass') {
    return 'PASS';
  }
  if (status === 'fail') {
    return 'FAIL';
  }
  return 'SKIPPED';
}

function cleanup(): void {
  for (const key of Object.keys(childProcesses)) {
    const child = childProcesses[key];
    if (child && !child.killed) {
      child.kill();
    }
  }
}

function runCommand(command: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
      process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });
    child.on('close', (code) => {
      resolve({ code: code ?? 0, stdout, stderr });
    });
  });
}
