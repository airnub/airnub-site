import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(".");
const basePath = path.join(root, "apps/speckit/messages/en-US.json");
const base = JSON.parse(fs.readFileSync(basePath, "utf8"));

const languages = ["en-GB", "fr", "es", "de", "pt", "it", "ga"];

const API_URL = "https://translate.googleapis.com/translate_a/single";

function shouldSkip(pathParts) {
  return pathParts.includes("items") && pathParts.includes("integrations");
}

function translateString(value, target) {
  const url = `${API_URL}?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(value)}`;
  const output = execFileSync("curl", ["-s", url], { encoding: "utf8" });
  const data = JSON.parse(output);
  const translated = data?.[0]?.[0]?.[0];
  if (typeof translated !== "string") {
    throw new Error(`Unexpected translation response for value: ${value}`);
  }
  return translated;
}

function translateValue(value, target, pathParts) {
  if (typeof value === "string") {
    if (shouldSkip(pathParts)) {
      return value;
    }
    return translateString(value, target);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => translateValue(item, target, [...pathParts, String(index)]));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, translateValue(nested, target, [...pathParts, key])])
    );
  }

  return value;
}

function main() {
  for (const language of languages) {
    const translated = translateValue(base, language, []);
    const targetPath = path.join(root, `apps/speckit/messages/${language}.json`);
    fs.writeFileSync(targetPath, JSON.stringify(translated, null, 2) + "\n");
    console.log(`Generated ${targetPath}`);
  }
}

main();
