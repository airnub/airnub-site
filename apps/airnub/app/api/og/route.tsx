import { promises as fs } from "node:fs";

import { ogTemplate } from "@airnub/brand";

export async function GET() {
  const template = await fs.readFile(ogTemplate);

  return new Response(template, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
