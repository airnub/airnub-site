import { fileURLToPath } from "node:url";

export const ogTemplateUrl = new URL("../public/og-template.png", import.meta.url);
export const ogTemplate = fileURLToPath(ogTemplateUrl);

export * from "./AirnubWordmark";
export * from "./SpeckitWordmark";
