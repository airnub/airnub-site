import { brand as airnubBrand, buildBrandOrganizationJsonLd } from "@airnub/brand";
import { itemListJsonLd } from "@airnub/seo";
import { AIRNUB_BASE_URL } from "./routes";

export function buildAirnubOrganizationJsonLd() {
  const sameAs = [airnubBrand.social.github, airnubBrand.social.linkedin].filter(
    (url): url is string => Boolean(url)
  );

  return buildBrandOrganizationJsonLd({
    brand: airnubBrand,
    baseUrl: AIRNUB_BASE_URL,
    overrides: {
      sameAs,
      contactPoint: [
        {
          telephone: "+1-415-555-0163",
          contactType: "sales",
          email: "hello@airnub.io",
          areaServed: "Global",
          availableLanguage: ["English"],
        },
      ],
    },
  });
}

export function buildAirnubProductPortfolioJsonLd() {
  return itemListJsonLd({
    name: "Airnub product portfolio",
    items: [
      {
        name: "Speckit",
        url: "https://speckit.airnub.io",
        description:
          "Developer workflow governance and evidence automation.",
      },
      {
        name: "Platform blueprints",
        url: `${AIRNUB_BASE_URL}/services#platform`,
        description:
          "Reference architectures and paved roads for platform teams.",
      },
      {
        name: "Trust accelerators",
        url: `${AIRNUB_BASE_URL}/services#trust`,
        description:
          "Compliance artifacts with automated evidence capture.",
      },
    ],
  });
}
