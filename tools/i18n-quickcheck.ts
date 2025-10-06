#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';

interface LocaleBundle {
  locale: string;
  entries: Record<string, string>;
  source: string;
}

interface LocaleDiffResult {
  locale: string;
  missingKeys: string[];
  extraKeys: string[];
  englishSuspicions: { key: string; value: string }[];
}

const sharedDir = path.resolve('packages/i18n/shared');
const appDirs = discoverAppMessageDirs();
const bundles = loadBundles([sharedDir, ...appDirs]);
const referenceKeys = buildReferenceKeys(bundles, ['en-GB', 'en-US']);
const results = analyzeLocales(bundles, referenceKeys);

report(results);

const hasFailures = results.some((result) => result.missingKeys.length > 0 || result.englishSuspicions.length > 0);
process.exit(hasFailures ? 1 : 0);

function discoverAppMessageDirs(): string[] {
  const appsRoot = path.resolve('apps');
  if (!fs.existsSync(appsRoot)) {
    return [];
  }

  const entries = fs.readdirSync(appsRoot, { withFileTypes: true });
  const dirs: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const candidate = path.join(appsRoot, entry.name, 'messages');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      dirs.push(candidate);
    }
  }

  return dirs;
}

function loadBundles(directories: string[]): LocaleBundle[] {
  const bundles: LocaleBundle[] = [];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      continue;
    }

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) {
        continue;
      }

      const locale = entry.name.replace(/\.json$/i, '');
      const filePath = path.join(dir, entry.name);
      const content = fs.readFileSync(filePath, 'utf8');
      let json: Record<string, unknown> = {};

      try {
        json = JSON.parse(content) as Record<string, unknown>;
      } catch (error) {
        throw new Error(`Invalid JSON in ${filePath}: ${(error as Error).message}`);
      }

      bundles.push({
        locale,
        entries: flattenEntries(json),
        source: filePath,
      });
    }
  }

  return bundles;
}

function flattenEntries(input: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(input)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[nextKey] = value;
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenEntries(value as Record<string, unknown>, nextKey));
    }
  }

  return result;
}

function buildReferenceKeys(bundles: LocaleBundle[], locales: string[]): Set<string> {
  const reference = new Set<string>();

  for (const locale of locales) {
    for (const bundle of bundles) {
      if (bundle.locale === locale) {
        for (const key of Object.keys(bundle.entries)) {
          reference.add(key);
        }
      }
    }
  }

  return reference;
}

function analyzeLocales(bundles: LocaleBundle[], referenceKeys: Set<string>): LocaleDiffResult[] {
  const results: LocaleDiffResult[] = [];

  for (const bundle of bundles) {
    if (bundle.locale === 'en-GB' || bundle.locale === 'en-US') {
      continue;
    }

    const keys = Object.keys(bundle.entries);
    const missingKeys = Array.from(referenceKeys).filter((key) => !keys.includes(key));
    const extraKeys = keys.filter((key) => !referenceKeys.has(key));
    const englishSuspicions = detectEnglishLeaks(bundle.entries);

    results.push({ locale: bundle.locale, missingKeys, extraKeys, englishSuspicions });
  }

  return results;
}

function detectEnglishLeaks(entries: Record<string, string>): { key: string; value: string }[] {
  const stopWords = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'your',
    'our',
    'please',
    'color',
    'colour',
    'contact',
    'email',
    'learn',
    'more',
    'team',
    'support',
    'privacy',
    'terms',
  ]);

  const suspicions: { key: string; value: string }[] = [];

  for (const [key, rawValue] of Object.entries(entries)) {
    const value = rawValue.trim();
    if (!value) {
      continue;
    }

    const words = value.toLowerCase().match(/[a-z]{3,}/g);
    if (!words || words.length === 0) {
      continue;
    }

    const matches = words.filter((word) => stopWords.has(word));
    if (matches.length >= 2) {
      suspicions.push({ key, value });
    }
  }

  return suspicions;
}

function report(results: LocaleDiffResult[]): void {
  if (results.length === 0) {
    console.log('i18n-quickcheck: No non-English locales detected.');
    return;
  }

  let hasIssues = false;

  for (const result of results) {
    if (result.missingKeys.length === 0 && result.englishSuspicions.length === 0) {
      continue;
    }

    hasIssues = true;
    console.log(`Locale: ${result.locale}`);

    if (result.missingKeys.length > 0) {
      console.log(`  Missing keys (${result.missingKeys.length}):`);
      for (const key of result.missingKeys.slice(0, 20)) {
        console.log(`    - ${key}`);
      }
      if (result.missingKeys.length > 20) {
        console.log('    ...');
      }
    }

    if (result.extraKeys.length > 0) {
      console.log(`  Extra keys (${result.extraKeys.length}):`);
      for (const key of result.extraKeys.slice(0, 20)) {
        console.log(`    - ${key}`);
      }
      if (result.extraKeys.length > 20) {
        console.log('    ...');
      }
    }

    if (result.englishSuspicions.length > 0) {
      console.log(`  Suspected English strings (${result.englishSuspicions.length}):`);
      for (const suspicion of result.englishSuspicions.slice(0, 20)) {
        console.log(`    - ${suspicion.key}: ${suspicion.value}`);
      }
      if (result.englishSuspicions.length > 20) {
        console.log('    ...');
      }
    }
  }

  if (!hasIssues) {
    console.log('i18n-quickcheck: All locales match reference keys.');
  }
}
