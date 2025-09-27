import type { JsonLd } from "@airnub/seo";
import { softwareApplicationJsonLd } from "@airnub/seo";
import { SPECKIT_BASE_URL } from "./routes";

export function buildSpeckitSoftwareJsonLd(): JsonLd {
  return softwareApplicationJsonLd({
    name: "Speckit",
    url: SPECKIT_BASE_URL,
    applicationCategory: "DevSecOps Application",
    description:
      "End vibe-coding. Ship secure, auditable releases with governed workflows and continuous evidence.",
    softwareHelp: "https://docs.speckit.dev",
    sameAs: [
      "https://github.com/airnub/speckit",
      "https://airnub.io",
    ],
  });
}
