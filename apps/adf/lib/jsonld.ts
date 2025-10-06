import { buildBrandSoftwareApplicationJsonLd } from "@airnub/brand";
import adfBrand from "../brand.config";
import { ADF_BASE_URL } from "./routes";

export function buildAdfSoftwareJsonLd() {
  const sameAs = [
    adfBrand.social.github,
    "https://airnub.io",
  ].filter((url): url is string => Boolean(url));

  return buildBrandSoftwareApplicationJsonLd({
    brand: adfBrand,
    baseUrl: ADF_BASE_URL,
    applicationCategory: "AI Software Development Framework",
    overrides: {
      description:
        "ADF delivers supervised, testable agent workflows with explicit human approvals and audit-ready evidence.",
      softwareHelp:
        process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/",
      sameAs,
    },
  });
}
