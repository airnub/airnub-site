import { promises as fs } from "node:fs";

import { ogTemplate } from "@airnub/brand/server";

export async function GET() {
  const template = await fs.readFile(ogTemplate);
  const arrayBuffer = template.buffer.slice(
    template.byteOffset,
    template.byteOffset + template.byteLength,
  ) as ArrayBuffer;
  const body = new Blob([arrayBuffer]);

  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
