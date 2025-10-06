#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { loadMessages } from "../packages/i18n/merge";

type IssueLevel = "error" | "warning";

type Issue = {
  level: IssueLevel;
  message: string;
};

type AppInfo = {
  name: string;
  messagesDir: string;
};

const DEFAULT_FALLBACKS = ["en-US", "en-GB"] as const;

const SPELLING_VARIANTS = [
  { us: "color", gb: "colour" },
  { us: "colors", gb: "colours" },
  { us: "colorize", gb: "colourise" },
  { us: "colorized", gb: "colourised" },
  { us: "coloring", gb: "colouring" },
  { us: "organize", gb: "organise" },
  { us: "organizes", gb: "organises" },
  { us: "organizing", gb: "organising" },
  { us: "organization", gb: "organisation" },
  { us: "organizations", gb: "organisations" },
  { us: "organizer", gb: "organiser" },
  { us: "organizers", gb: "organisers" },
  { us: "optimize", gb: "optimise" },
  { us: "optimizes", gb: "optimises" },
  { us: "optimizing", gb: "optimising" },
  { us: "optimization", gb: "optimisation" },
  { us: "analyze", gb: "analyse" },
  { us: "analyzes", gb: "analyses" },
  { us: "analyzing", gb: "analysing" },
  { us: "modeling", gb: "modelling" },
  { us: "modeler", gb: "modeller" },
  { us: "modelers", gb: "modellers" },
  { us: "center", gb: "centre" },
  { us: "centers", gb: "centres" },
  { us: "behavior", gb: "behaviour" },
  { us: "license", gb: "licence" },
  { us: "gray", gb: "grey" },
  { us: "meter", gb: "metre" },
  { us: "meters", gb: "metres" },
];

const VARIANT_EXCEPTIONS = [/trust center/i];

const LANGUAGE_LEAK_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bTODO\b/u, label: "TODO marker" },
  { pattern: /\bTBD\b/u, label: "TBD marker" },
  { pattern: /\bFIXME\b/u, label: "FIXME marker" },
  { pattern: /@@/u, label: "double at placeholder" },
];

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function findRepoRoot(startDir: string): Promise<string> {
  let current = startDir;
  while (true) {
    if (await pathExists(path.join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return startDir;
    }
    current = parent;
  }
}

type FlattenResult = {
  keys: Set<string>;
  strings: Map<string, string>;
};

function flattenMessages(value: unknown): FlattenResult {
  const keys = new Set<string>();
  const strings = new Map<string, string>();

  function walk(node: unknown, prefix: string) {
    if (Array.isArray(node)) {
      if (prefix && node.length === 0) {
        keys.add(prefix);
      }
      node.forEach((child, index) => {
        const childPath = prefix ? `${prefix}[${index}]` : `[${index}]`;
        walk(child, childPath);
      });
      return;
    }

    if (node && typeof node === "object") {
      const entries = Object.entries(node as Record<string, unknown>);
      if (entries.length === 0 && prefix) {
        keys.add(prefix);
      }
      for (const [key, child] of entries) {
        const childPath = prefix ? `${prefix}.${key}` : key;
        walk(child, childPath);
      }
      return;
    }

    if (!prefix) {
      return;
    }

    keys.add(prefix);
    if (typeof node === "string") {
      strings.set(prefix, node);
    }
  }

  walk(value, "");

  return { keys, strings };
}

function collectLocalesFromDir(dir: string): Promise<string[]> {
  return fs
    .readdir(dir, { withFileTypes: true })
    .then((entries) =>
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name.replace(/\.json$/u, "")),
    );
}

function getVariantIssues(locale: string, strings: Map<string, string>): Issue[] {
  if (locale !== "en-US" && locale !== "en-GB") {
    return [];
  }

  const issues: Issue[] = [];

  for (const [pathKey, value] of strings) {
    if (VARIANT_EXCEPTIONS.some((exception) => exception.test(value))) {
      continue;
    }
    for (const pair of SPELLING_VARIANTS) {
      if (locale === "en-US") {
        const pattern = new RegExp(`\\b${pair.gb}\\b`, "i");
        if (pattern.test(value)) {
          issues.push({
            level: "error",
            message: `en-US string at \`${pathKey}\` uses British spelling "${pair.gb}". Prefer "${pair.us}".`,
          });
        }
      } else if (locale === "en-GB") {
        const pattern = new RegExp(`\\b${pair.us}\\b`, "i");
        if (pattern.test(value)) {
          issues.push({
            level: "error",
            message: `en-GB string at \`${pathKey}\` uses US spelling "${pair.us}". Prefer "${pair.gb}".`,
          });
        }
      }
    }
  }

  return issues;
}

function getLanguageLeakIssues(locale: string, strings: Map<string, string>): Issue[] {
  if (locale.startsWith("en")) {
    return [];
  }

  const issues: Issue[] = [];

  for (const [pathKey, value] of strings) {
    for (const { pattern, label } of LANGUAGE_LEAK_PATTERNS) {
      if (pattern.test(value)) {
        issues.push({
          level: "error",
          message: `${locale} translation at \`${pathKey}\` still contains a ${label}. Replace it with localized content.`,
        });
        break;
      }
    }
  }

  return issues;
}

async function discoverApps(appsDir: string): Promise<AppInfo[]> {
  const entries = await fs.readdir(appsDir, { withFileTypes: true });
  const apps: AppInfo[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const messagesDir = path.join(appsDir, entry.name, "messages");
    if (await pathExists(messagesDir)) {
      apps.push({ name: entry.name, messagesDir });
    }
  }

  return apps;
}

function diffKeys(reference: Set<string>, candidate: Set<string>) {
  const missing: string[] = [];
  const extra: string[] = [];

  for (const key of reference) {
    if (!candidate.has(key)) {
      missing.push(key);
    }
  }

  for (const key of candidate) {
    if (!reference.has(key)) {
      extra.push(key);
    }
  }

  return { missing, extra };
}

async function ensureReviewFile(app: AppInfo, issues: Issue[]) {
  const reviewFile = path.join(app.messagesDir, "REVIEW.md");
  if (!(await pathExists(reviewFile))) {
    issues.push({
      level: "error",
      message: `Missing \`${path.relative(process.cwd(), reviewFile)}\`. Add the reviewer checklist before modifying translations.`,
    });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");

  const repoRoot = await findRepoRoot(process.cwd());
  const sharedDir = path.join(repoRoot, "packages", "i18n", "shared");
  const appsDir = path.join(repoRoot, "apps");

  if (!(await pathExists(sharedDir))) {
    console.error(`Unable to find shared messages directory at ${sharedDir}`);
    process.exit(1);
  }

  if (!(await pathExists(appsDir))) {
    console.error(`Unable to find apps directory at ${appsDir}`);
    process.exit(1);
  }

  const apps = await discoverApps(appsDir);

  if (apps.length === 0) {
    console.error("No apps with messages/ directories were found under apps/.");
    process.exit(1);
  }

  const localeSet = new Set<string>();

  for (const locale of await collectLocalesFromDir(sharedDir)) {
    localeSet.add(locale);
  }

  for (const app of apps) {
    for (const locale of await collectLocalesFromDir(app.messagesDir)) {
      localeSet.add(locale);
    }
  }

  if (!localeSet.has("en-US")) {
    console.error("The en-US locale is required for key comparisons but was not found.");
    process.exit(1);
  }

  const locales = Array.from(localeSet).sort();

  const errors: Issue[] = [];
  const warnings: Issue[] = [];

  for (const app of apps) {
    await ensureReviewFile(app, errors);

    let baseMessages: unknown;
    try {
      baseMessages = await loadMessages(app.name, "en-US", { fallbackLocales: Array.from(DEFAULT_FALLBACKS) });
    } catch (error) {
      errors.push({
        level: "error",
        message: `Failed to load en-US messages for ${app.name}: ${(error as Error).message}`,
      });
      continue;
    }

    const baseFlatten = flattenMessages(baseMessages);

    for (const locale of locales) {
      let merged: unknown;
      try {
        merged = await loadMessages(app.name, locale, { fallbackLocales: Array.from(DEFAULT_FALLBACKS) });
      } catch (error) {
        errors.push({
          level: "error",
          message: `Failed to load messages for ${app.name} (${locale}): ${(error as Error).message}`,
        });
        continue;
      }

      const candidateFlatten = flattenMessages(merged);
      const { missing, extra } = diffKeys(baseFlatten.keys, candidateFlatten.keys);

      if (missing.length > 0) {
        errors.push({
          level: "error",
          message: `${app.name} (${locale}) is missing ${missing.length} key(s): ${missing
            .slice(0, 10)
            .map((key) => `\`${key}\``)
            .join(", ")} ${missing.length > 10 ? "…" : ""}`.trim(),
        });
      }

      if (extra.length > 0) {
        errors.push({
          level: "error",
          message: `${app.name} (${locale}) has ${extra.length} unexpected key(s): ${extra
            .slice(0, 10)
            .map((key) => `\`${key}\``)
            .join(", ")} ${extra.length > 10 ? "…" : ""}`.trim(),
        });
      }

      for (const issue of getVariantIssues(locale, candidateFlatten.strings)) {
        errors.push(issue);
      }

      for (const issue of getLanguageLeakIssues(locale, candidateFlatten.strings)) {
        (strict ? errors : warnings).push(issue);
      }
    }
  }

  const uniqueErrors = errors;
  const uniqueWarnings = warnings;

  if (uniqueErrors.length > 0 || (strict && uniqueWarnings.length > 0)) {
    const allIssues = [...uniqueErrors, ...(strict ? uniqueWarnings : [])];
    console.error(`\n❌ i18n sync detected ${allIssues.length} issue(s):`);
    for (const issue of allIssues) {
      console.error(`  - ${issue.message}`);
    }
    if (!strict && uniqueWarnings.length > 0) {
      console.warn(`\n⚠️  ${uniqueWarnings.length} warning(s) reported (use --strict to fail on warnings).`);
    }
    process.exit(1);
  }

  if (uniqueWarnings.length > 0) {
    console.warn(`\n⚠️  i18n sync completed with ${uniqueWarnings.length} warning(s):`);
    for (const issue of uniqueWarnings) {
      console.warn(`  - ${issue.message}`);
    }
  } else {
    console.log(`✅ i18n sync passed for ${apps.length} app(s) across ${locales.length} locale(s).`);
  }
}

void main();
