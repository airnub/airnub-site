import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { ogTemplate } from "@airnub/brand/server";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/svg+xml";

export default async function Icon() {
  const brandDir = dirname(ogTemplate);
  const faviconPath = join(brandDir, "favicon.svg");
  const file = await fs.readFile(faviconPath);
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
