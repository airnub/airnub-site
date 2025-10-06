import { promises as fs } from "node:fs";
import { ogTemplate } from "@airnub/brand/server";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image() {
  const file = await fs.readFile(ogTemplate);
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
