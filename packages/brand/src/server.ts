import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ogTemplateUrl = new URL("../public/brand/og.png", import.meta.url);

const packageDir = dirname(fileURLToPath(import.meta.url));
export const ogTemplate = join(packageDir, "../public/brand/og.png");
