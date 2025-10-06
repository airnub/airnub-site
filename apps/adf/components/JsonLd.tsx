import type { JsonLd } from "@airnub/seo";

export function JsonLd({ data }: { data: JsonLd }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
