#!/usr/bin/env tsx

import { URL } from 'node:url';
import { get } from './http';

export interface LinkCheckOptions {
  maxDepth?: number;
  maxPages?: number;
  timeoutMs?: number;
}

export interface LinkCheckFinding {
  url: string;
  status: number;
  message?: string;
}

export interface LinkCheckReport {
  visited: string[];
  broken: LinkCheckFinding[];
}

export async function crawl(startUrl: string, options: LinkCheckOptions = {}): Promise<LinkCheckReport> {
  const origin = new URL(startUrl).origin;
  const maxDepth = options.maxDepth ?? 2;
  const maxPages = options.maxPages ?? 20;
  const timeoutMs = options.timeoutMs ?? 5000;
  const queue: Array<{ url: string; depth: number }> = [{ url: startUrl, depth: 0 }];
  const visited = new Set<string>();
  const broken: LinkCheckFinding[] = [];

  while (queue.length > 0 && visited.size < maxPages) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    if (visited.has(current.url)) {
      continue;
    }

    visited.add(current.url);

    let response;
    try {
      response = await get(current.url, { timeoutMs, responseType: 'text' });
    } catch (error) {
      broken.push({ url: current.url, status: 0, message: (error as Error).message });
      continue;
    }

    if (response.status >= 400) {
      broken.push({ url: current.url, status: response.status });
      continue;
    }

    if (current.depth >= maxDepth) {
      continue;
    }

    const contentType = String(response.headers['content-type'] ?? '');
    if (!contentType.includes('text/html')) {
      continue;
    }

    const links = extractLinks(String(response.body), origin);
    for (const link of links) {
      if (!visited.has(link) && !queue.find((item) => item.url === link)) {
        queue.push({ url: link, depth: current.depth + 1 });
      }
    }
  }

  return { visited: Array.from(visited), broken };
}

function extractLinks(html: string, origin: string): string[] {
  const links = new Set<string>();
  const anchorRegex = /<a\s[^>]*href=["']([^"'#?]+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    try {
      const url = new URL(href, origin);
      if (url.origin === origin) {
        links.add(url.href.replace(/#.*$/, ''));
      }
    } catch (error) {
      // Ignore invalid URLs
    }
  }

  return Array.from(links);
}

if (require.main === module) {
  const startUrl = process.argv[2];
  if (!startUrl) {
    console.error('Usage: tsx tools/link-check.ts <url>');
    process.exit(1);
  }

  crawl(startUrl)
    .then((report) => {
      if (report.broken.length === 0) {
        console.log(`Link check passed with ${report.visited.length} pages.`);
        return;
      }

      console.log(`Link check found ${report.broken.length} broken links:`);
      for (const finding of report.broken) {
        console.log(` - ${finding.url} (${finding.status}${finding.message ? `: ${finding.message}` : ''})`);
      }
      process.exit(1);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
