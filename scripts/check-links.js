#!/usr/bin/env node
const { readdir, readFile, stat } = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");

const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "build",
  "coverage",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".html",
]);

const HTTP_STATUS_OK = new Set([200, 201, 202, 203, 204, 205, 206, 207, 208, 226]);
const HTTP_STATUS_REDIRECT = new Set([300, 301, 302, 303, 304, 307, 308]);

const IGNORED_HOSTNAMES = new Set(
  (process.env.LINK_CHECK_IGNORE_HOSTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);

const DEFAULT_TIMEOUT_MS = Number.parseInt(process.env.LINK_CHECK_TIMEOUT ?? "10000", 10);
const CONCURRENCY = Number.parseInt(process.env.LINK_CHECK_CONCURRENCY ?? "8", 10);

/** @type {Set<string>} */
const failures = new Set();
/** @type {Set<string>} */
const visited = new Set();

function isHttpLink(value) {
  return /^https?:\/\//i.test(value);
}

function normalizeLink(value) {
  return value.replace(/[\])>\"'*,.;]+$/g, "");
}

function extractLinks(content) {
  const results = new Set();
  const urlPattern = /https?:\/\/[\w\-._~:/?#@!$&'*+,;=%]+/gi;
  let match;
  while ((match = urlPattern.exec(content))) {
    const link = normalizeLink(match[0]);
    if (isHttpLink(link)) {
      results.add(link);
    }
  }
  return Array.from(results);
}

async function* walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRECTORIES.has(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(entryPath);
    } else if (ALLOWED_EXTENSIONS.has(path.extname(entry.name))) {
      yield entryPath;
    }
  }
}

async function readLinksFromFile(filePath) {
  const content = await readFile(filePath, "utf8");
  return extractLinks(content);
}

async function checkLink(link, fromFile) {
  if (visited.has(link)) return;
  visited.add(link);

  try {
    const { hostname } = new URL(link);
    if (IGNORED_HOSTNAMES.has(hostname)) {
      return;
    }
  } catch {
    failures.add(`${link} (error: invalid URL) ← ${fromFile}`);
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    let response = await fetch(link, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    if (response.status === 405 || response.status === 501) {
      response = await fetch(link, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
    }
    if (!(HTTP_STATUS_OK.has(response.status) || HTTP_STATUS_REDIRECT.has(response.status))) {
      failures.add(`${link} (status: ${response.status}) ← ${fromFile}`);
    }
  } catch (error) {
    failures.add(`${link} (error: ${error instanceof Error ? error.message : String(error)}) ← ${fromFile}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function run(directory) {
  const files = [];
  for await (const filePath of walk(directory)) {
    files.push(filePath);
  }

  if (files.length === 0) {
    console.log(`No files with linkable content found in ${directory}`);
    return;
  }

  const tasks = [];
  for (const filePath of files) {
    const links = await readLinksFromFile(filePath);
    for (const link of links) {
      tasks.push({ link, fromFile: path.relative(process.cwd(), filePath) });
    }
  }

  if (tasks.length === 0) {
    console.log(`No HTTP links discovered in ${directory}`);
    return;
  }

  console.log(`Discovered ${tasks.length} unique link references across ${files.length} files.`);

  let index = 0;
  async function worker() {
    while (index < tasks.length) {
      const current = tasks[index++];
      await checkLink(current.link, current.fromFile);
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, worker);
  await Promise.all(workers);
}

async function main() {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : [process.cwd()];
  for (const target of targets) {
    const absolute = path.resolve(target);
    let stats;
    try {
      stats = await stat(absolute);
    } catch (error) {
      console.error(`Skipping ${target}: ${(error instanceof Error ? error.message : String(error))}`);
      continue;
    }
    if (stats.isDirectory()) {
      await run(absolute);
    } else {
      const content = await readFile(absolute, "utf8");
      const links = extractLinks(content);
      await Promise.all(links.map((link) => checkLink(link, path.relative(process.cwd(), absolute))));
    }
  }

  if (failures.size > 0) {
    console.error("Broken links detected:");
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exitCode = 1;
  } else {
    console.log("All links resolved successfully.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
