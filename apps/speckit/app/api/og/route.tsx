import { ogTemplateUrl } from "@airnub/brand";

export const runtime = "edge";

export async function GET() {
  const template = await fetch(ogTemplateUrl).then((response) => response.arrayBuffer());

  return new Response(template, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
