import { promises as fs } from "node:fs";
import path from "node:path";

export type LoadMessagesOptions = {
  fallbackLocales?: string[];
};

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type Messages = JsonObject;

type SharedBundle = Record<string, Messages>;

const DEFAULT_FALLBACKS = ["en-US", "en-GB"] as const;

type AppName = "airnub" | "speckit" | "adf" | (string & {});

function getLocaleCandidates(locale: string, fallbacks: readonly string[]) {
  const candidates = [locale];
  for (const fallback of fallbacks) {
    if (!candidates.includes(fallback)) {
      candidates.push(fallback);
    }
  }
  return candidates;
}

async function readJsonFile(filePath: string): Promise<JsonObject | null> {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return JSON.parse(contents) as JsonObject;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function isPlainObject(value: JsonValue): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep<T extends JsonValue>(target: T, source: T): T {
  if (Array.isArray(target) && Array.isArray(source)) {
    return source as T;
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    const result: JsonObject = { ...target };
    for (const [key, value] of Object.entries(source)) {
      if (key in result) {
        result[key] = mergeDeep(result[key], value as JsonValue);
      } else {
        result[key] = value as JsonValue;
      }
    }
    return result as T;
  }

  return source;
}

export async function loadMessages(
  app: AppName,
  locale: string,
  options: LoadMessagesOptions = {}
): Promise<Messages> {
  const fallbacks = options.fallbackLocales ?? DEFAULT_FALLBACKS;
  const repoRoot = process.cwd();
  const sharedDir = path.join(repoRoot, "packages", "i18n", "shared");
  const appMessagesDir = path.join(repoRoot, "apps", app, "messages");

  const sharedMessages = await (async () => {
    for (const candidate of getLocaleCandidates(locale, fallbacks)) {
      const candidatePath = path.join(sharedDir, `${candidate}.json`);
      const bundle = await readJsonFile(candidatePath);
      if (!bundle || !isPlainObject(bundle)) {
        continue;
      }
      const scoped = (bundle as SharedBundle)[app];
      if (scoped && isPlainObject(scoped)) {
        return scoped as Messages;
      }
    }
    return {} as Messages;
  })();

  const appMessages = await (async () => {
    for (const candidate of getLocaleCandidates(locale, fallbacks)) {
      const candidatePath = path.join(appMessagesDir, `${candidate}.json`);
      const bundle = await readJsonFile(candidatePath);
      if (bundle) {
        return bundle as Messages;
      }
    }
    return {} as Messages;
  })();

  return mergeDeep(sharedMessages as Messages, appMessages as Messages);
}
