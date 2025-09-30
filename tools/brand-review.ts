/* tools/brand-review.ts */
import fs from "fs";
import path from "path";
import pc from "picocolors";

type AppFinding = {
  app: string;
  hasTokensImport: boolean;
  tokensImportPath?: string;
  hasSharedHeaderFooter: boolean;
  foundSiteChromeImports: string[];
  localHeaderFooterFiles: string[];
  hasIconRoute: boolean;
  hasOGRoute: boolean;
  ogRouteReferencesBrandTemplate: boolean;
  tailwindHasBrandPreset: boolean;
  tailwindFile?: string;
  hardcodedColorHits: { file: string; line: number; match: string }[];
  strayImages: string[];
  assetDrift: {
    missingInApp: string[];
    extraInApp: string[];
  };
};

type RepoFinding = {
  rootScripts: Record<string, string>;
  hasBrandSyncScript: boolean;
  hasBrandCheckScript: boolean;
  brandConfigFile?: string;
  brandAssetsDir: string | null;
  brandPublicDir: string | null;
  ciBrandSyncPresent: boolean;
  ciBrandCheckPresent: boolean;
};

type Report = {
  timestamp: string;
  addressed: string[];
  outstanding: string[];
  apps: AppFinding[];
  repo: RepoFinding;
};

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, "apps");
const PKG_BRAND = path.join(ROOT, "packages", "brand");
const BRAND_ASSETS_ROOT = path.join(ROOT, ".brand", "public", "brand");
const BRAND_PUBLIC = path.join(PKG_BRAND, "public", "brand");

function fileExists(p: string) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function readMaybe(p: string) {
  return fileExists(p) ? fs.readFileSync(p, "utf8") : "";
}

type ListOptions = {
  exts?: string[];
  ignore?: string[];
};

function listFiles(dir: string, options: ListOptions = {}): string[] {
  if (!fileExists(dir)) return [];
  const exts = options.exts ?? [];
  const ignoreSet = new Set(options.ignore ?? []);
  const out: string[] = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    const rel = path.relative(ROOT, abs);
    const parts = rel.split(path.sep);
    if (parts.some(p => ignoreSet.has(p))) continue;
    if (ent.isDirectory()) {
      out.push(...listFiles(abs, options));
    } else if (exts.length === 0 || exts.includes(path.extname(ent.name).toLowerCase())) {
      out.push(abs);
    }
  }
  return out;
}

function findFirstExisting(base: string, candidates: string[]): string | undefined {
  return candidates.map(p => path.join(base, p)).find(fileExists);
}

function relativeToRoot(p: string) {
  return path.relative(ROOT, p);
}

async function main() {
  const report: Report = {
    timestamp: new Date().toISOString(),
    addressed: [],
    outstanding: [],
    apps: [],
    repo: {
      rootScripts: {},
      hasBrandSyncScript: false,
      hasBrandCheckScript: false,
      brandConfigFile: undefined,
      brandAssetsDir: fileExists(BRAND_ASSETS_ROOT) ? BRAND_ASSETS_ROOT : null,
      brandPublicDir: fileExists(BRAND_PUBLIC) ? BRAND_PUBLIC : null,
      ciBrandSyncPresent: false,
      ciBrandCheckPresent: false
    }
  };

  const rootPkg = readMaybe(path.join(ROOT, "package.json"));
  if (rootPkg) {
    const pkg = JSON.parse(rootPkg);
    report.repo.rootScripts = pkg.scripts ?? {};
    const scripts = report.repo.rootScripts;
    report.repo.hasBrandSyncScript = Boolean(scripts && scripts["brand:sync"]);
    report.repo.hasBrandCheckScript = Boolean(scripts && scripts["brand:check"]);
  }

  const workflowDir = path.join(ROOT, ".github", "workflows");
  const ciFiles = listFiles(workflowDir, { exts: [".yml", ".yaml"] });
  for (const file of ciFiles) {
    const yml = readMaybe(file);
    if (/brand:sync/.test(yml)) report.repo.ciBrandSyncPresent = true;
    if (/brand:check/.test(yml)) report.repo.ciBrandCheckPresent = true;
  }

  const brandConfigCandidates = [
    path.join(PKG_BRAND, "src", "brand.config.ts"),
    path.join(PKG_BRAND, "brand.config.ts"),
    path.join(PKG_BRAND, "src", "config.ts")
  ];
  for (const c of brandConfigCandidates) {
    if (fileExists(c)) {
      report.repo.brandConfigFile = c;
      break;
    }
  }

  const apps = (fileExists(APPS_DIR)
    ? fs.readdirSync(APPS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
    : []).filter(name => fileExists(path.join(APPS_DIR, name, "app")));

  for (const app of apps) {
    const appRoot = path.join(APPS_DIR, app);
    const appFinding: AppFinding = {
      app,
      hasTokensImport: false,
      tokensImportPath: undefined,
      hasSharedHeaderFooter: false,
      foundSiteChromeImports: [],
      localHeaderFooterFiles: [],
      hasIconRoute: false,
      hasOGRoute: false,
      ogRouteReferencesBrandTemplate: false,
      tailwindHasBrandPreset: false,
      tailwindFile: undefined,
      hardcodedColorHits: [],
      strayImages: [],
      assetDrift: { missingInApp: [], extraInApp: [] }
    };

    const layoutPath = findFirstExisting(appRoot, ["app/layout.tsx", "app/layout.ts"]);
    if (layoutPath) {
      const layout = readMaybe(layoutPath);
      const tokensMatch = layout.match(/@airnub\/brand\/runtime\/tokens[^\s'\"]*/);
      if (tokensMatch) {
        appFinding.hasTokensImport = true;
        appFinding.tokensImportPath = tokensMatch[0];
      }
      const chromeImports = layout.match(/@airnub\/ui[^\s'\"]*/g) ?? [];
      appFinding.foundSiteChromeImports = chromeImports;
      if (chromeImports.length && /SiteHeader|SiteFooter/.test(layout)) {
        appFinding.hasSharedHeaderFooter = true;
      }
    }

    const tsxFiles = listFiles(appRoot, { exts: [".tsx"], ignore: ["node_modules"] });
    appFinding.localHeaderFooterFiles = tsxFiles
      .filter(file => /Header|Footer/.test(path.basename(file)))
      .map(file => path.relative(appRoot, file))
      .filter(file => !/SiteHeader|SiteFooter/i.test(file));

    appFinding.hasIconRoute = ["app/icon.tsx", "app/icon.ts"].some(p => fileExists(path.join(appRoot, p)));

    const ogPath = findFirstExisting(appRoot, ["app/opengraph-image.tsx", "app/opengraph-image.ts"]);
    if (ogPath) {
      appFinding.hasOGRoute = true;
      const ogSrc = readMaybe(ogPath);
      appFinding.ogRouteReferencesBrandTemplate = /@airnub\/brand\/og\/template/.test(ogSrc);
    }

    const tailwindPath = findFirstExisting(appRoot, [
      "tailwind.config.ts",
      "tailwind.config.js",
      "tailwind.config.cjs",
      "tailwind.config.mjs"
    ]);
    if (tailwindPath) {
      appFinding.tailwindFile = tailwindPath;
      const tw = readMaybe(tailwindPath);
      if (/@airnub\/ui\/tailwind\.brand/.test(tw) || /--brand-/.test(tw)) {
        appFinding.tailwindHasBrandPreset = true;
      }
    }

    const sourceDirs = ["app", "components"]
      .map(dir => path.join(appRoot, dir))
      .filter(fileExists);
    const srcFiles = sourceDirs.flatMap(dir => listFiles(dir, { exts: [".ts", ".tsx"], ignore: ["node_modules"] }));
    const badPatterns = [/bg-\[#/g, /text-\[#/g, /dark:/g];
    for (const file of srcFiles) {
      const txt = fs.readFileSync(file, "utf8");
      const lines = txt.split(/\r?\n/);
      lines.forEach((line, idx) => {
        for (const pat of badPatterns) {
          if (pat.test(line)) {
            appFinding.hardcodedColorHits.push({
              file,
              line: idx + 1,
              match: line.trim().slice(0, 140)
            });
            break;
          }
        }
      });
    }

    const publicDir = path.join(appRoot, "public");
    const imageFiles = listFiles(publicDir, {
      exts: [".svg", ".png", ".jpg", ".jpeg", ".ico"],
      ignore: ["node_modules"]
    });
    appFinding.strayImages = imageFiles
      .filter(file => !file.includes(`${path.sep}brand${path.sep}`))
      .filter(file => !/favicon-16x16\.png$/.test(file))
      .filter(file => !/favicon-32x32\.png$/.test(file))
      .filter(file => !/apple-touch-icon\.png$/.test(file))
      .map(file => path.relative(appRoot, file));

    const appBrandDir = path.join(publicDir, "brand");
    const brandSet = new Set(listFiles(BRAND_PUBLIC, { exts: [".svg", ".png"], ignore: ["node_modules"] }).map(f => path.basename(f)));
    const appSet = new Set(listFiles(appBrandDir, { exts: [".svg", ".png"], ignore: ["node_modules"] }).map(f => path.basename(f)));
    for (const f of brandSet) if (!appSet.has(f)) appFinding.assetDrift.missingInApp.push(f);
    for (const f of appSet) if (!brandSet.has(f)) appFinding.assetDrift.extraInApp.push(f);

    report.apps.push(appFinding);
  }

  if (report.repo.brandAssetsDir) report.addressed.push("Central brand assets directory exists: `.brand/public/brand`.");
  if (report.repo.brandPublicDir) report.addressed.push("Brand assets are synced to `packages/brand/public/brand`.");
  if (report.repo.hasBrandSyncScript) report.addressed.push("Root script `brand:sync` is present.");
  if (report.repo.brandConfigFile) report.addressed.push("Brand config file is present: " + relativeToRoot(report.repo.brandConfigFile));

  for (const a of report.apps) {
    if (!a.hasTokensImport) report.outstanding.push(`[${a.app}] Missing import of brand tokens in \`app/layout\` (expected \`@airnub/brand/runtime/tokens*.css\`).`);
    if (!a.hasSharedHeaderFooter) report.outstanding.push(`[${a.app}] Shared site chrome not detected (expect imports from \`@airnub/ui\` and usage of <SiteHeader/> + <SiteFooter/>).`);
    if (a.localHeaderFooterFiles.length) report.outstanding.push(`[${a.app}] Local header/footer components present: ${a.localHeaderFooterFiles.slice(0, 5).join(", ")}.`);
    if (!a.hasIconRoute) report.outstanding.push(`[${a.app}] Missing \`app/icon.tsx\` route for favicon generation.`);
    if (!a.hasOGRoute) report.outstanding.push(`[${a.app}] Missing \`app/opengraph-image.tsx\` route for OG images.`);
    if (a.hasOGRoute && !a.ogRouteReferencesBrandTemplate) report.outstanding.push(`[${a.app}] OG route does not delegate to \`@airnub/brand/og/template\`.`);
    if (!a.tailwindHasBrandPreset) report.outstanding.push(`[${a.app}] Tailwind not clearly wired to brand preset or CSS variables.`);
    if (a.hardcodedColorHits.length) report.outstanding.push(`[${a.app}] Found hard-coded color/dark overrides (${a.hardcodedColorHits.length} hits).`);
    if (a.strayImages.length) report.outstanding.push(`[${a.app}] Found images outside \`public/brand\`: ${a.strayImages.slice(0, 5).join(", ")}.`);
    if (a.assetDrift.missingInApp.length || a.assetDrift.extraInApp.length) {
      report.outstanding.push(`[${a.app}] Brand asset drift — missing in app: [${a.assetDrift.missingInApp.join(", ") || ""}] , extra in app: [${a.assetDrift.extraInApp.join(", ") || ""}].`.replace(/\s+/g, " "));
    }
  }
  if (!report.repo.ciBrandSyncPresent) report.outstanding.push("CI does not run `pnpm brand:sync` before build.");
  if (report.repo.hasBrandCheckScript && !report.repo.ciBrandCheckPresent) report.outstanding.push("CI does not run `pnpm brand:check`.");

  const reviewDir = path.join(ROOT, "review");
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(path.join(reviewDir, "brand-review.json"), JSON.stringify(report, null, 2));

  const md: string[] = [];
  md.push(`# Brand & Shared UI Review`);
  md.push(`_Generated: ${report.timestamp}_`);
  md.push("");
  md.push("## Addressed");
  md.push(report.addressed.length ? report.addressed.map(x => `- ${x}`).join("\n") : "- (none detected)");
  md.push("");
  md.push("## Outstanding");
  md.push(report.outstanding.length ? report.outstanding.map(x => `- ${x}`).join("\n") : "- (none detected)");
  md.push("");
  for (const a of report.apps) {
    md.push(`## App: ${a.app}`);
    md.push(`- Tokens import: ${a.hasTokensImport ? pc.green("YES") : pc.red("NO")} ${a.tokensImportPath ?? ""}`);
    md.push(`- Shared header/footer: ${a.hasSharedHeaderFooter ? pc.green("YES") : pc.red("NO")} (imports: ${a.foundSiteChromeImports.join(", ") || "—"})`);
    md.push(`- Local header/footer files: ${a.localHeaderFooterFiles.length ? a.localHeaderFooterFiles.join(", ") : "—"}`);
    md.push(`- Icon route: ${a.hasIconRoute ? "YES" : "NO"}`);
    md.push(`- OG route: ${a.hasOGRoute ? "YES" : "NO"}; uses brand template: ${a.ogRouteReferencesBrandTemplate ? "YES" : "NO"}`);
    md.push(`- Tailwind brand preset/CSS vars: ${a.tailwindHasBrandPreset ? "YES" : "NO"} (${a.tailwindFile ? relativeToRoot(a.tailwindFile) : "no tailwind config found"})`);
    md.push(`- Hard-coded color hits: ${a.hardcodedColorHits.length}`);
    if (a.hardcodedColorHits.length) {
      md.push(`<details><summary>Examples</summary>\n\n` +
        a.hardcodedColorHits.slice(0, 10).map(h => `- \`${relativeToRoot(h.file)}:${h.line}\` — \`${h.match}\``).join("\n") +
        `\n\n</details>`);
    }
    md.push(`- Stray images: ${a.strayImages.length ? a.strayImages.slice(0, 10).join(", ") : "—"}`);
    md.push(`- Asset drift → missing in app: [${a.assetDrift.missingInApp.join(", ") || "—"}]; extra in app: [${a.assetDrift.extraInApp.join(", ") || "—"}]`);
    md.push("");
  }
  fs.writeFileSync(path.join(reviewDir, "brand-review.md"), md.join("\n"));

  console.log(pc.bold(pc.green("✔ Wrote review/brand-review.md and review/brand-review.json")));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
