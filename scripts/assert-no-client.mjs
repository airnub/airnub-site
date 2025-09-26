import { globby } from "globby";
import fs from "node:fs/promises";

const paths = await globby(["apps/**/app/**/*.{tsx,ts}", "packages/**/src/**/*.{tsx,ts}"], { gitignore: true });
const offenders = [];

for (const p of paths) {
  const src = await fs.readFile(p, "utf8");
  if (src.startsWith("\"use client\"") && !p.includes("/components/client/")) {
    offenders.push(p);
  }
}

if (offenders.length) {
  console.error("Client components found outside components/client/:\n" + offenders.join("\n"));
  process.exit(1);
}

console.log("SSR guard: OK");
