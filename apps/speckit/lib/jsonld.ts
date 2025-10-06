import { buildBrandSoftwareApplicationJsonLd } from "@airnub/brand";
import { SPECKIT_BASE_URL } from "./routes";
import speckitBrand from "../brand.config";

export function buildSpeckitSoftwareJsonLd() {
  const sameAs = [
    speckitBrand.social.github,
    "https://airnub.io",
  ].filter((url): url is string => Boolean(url));

  return buildBrandSoftwareApplicationJsonLd({
    brand: speckitBrand,
    baseUrl: SPECKIT_BASE_URL,
    applicationCategory: "DevSecOps Application",
    overrides: {
      description:
        "End vibe‑coding. One spec → compliant releases with governed workflows and continuous evidence.",
      softwareHelp: "https://docs.speckit.dev",
      sameAs,
    },
  });
}
