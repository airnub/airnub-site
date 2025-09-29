import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ogTemplateUrl = new URL("../public/og-template.png", import.meta.url);
const packageDir = dirname(fileURLToPath(import.meta.url));
export const ogTemplate = join(packageDir, "../public/og-template.png");

export * from "./AirnubWordmark";
export * from "./SpeckitWordmark";
export * from "./brand.config";
