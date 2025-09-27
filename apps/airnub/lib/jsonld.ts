import type { JsonLd } from "@airnub/seo";
import { itemListJsonLd, organizationJsonLd } from "@airnub/seo";
import { AIRNUB_BASE_URL, AIRNUB_ROUTES } from "./routes";

const SPECKIT_BASE_URL = "https://speckit.airnub.io";

export function buildAirnubOrganizationJsonLd(): JsonLd {
  return organizationJsonLd({
    name: "Airnub",
    url: AIRNUB_BASE_URL,
    logo: `${AIRNUB_BASE_URL}/api/og`,
    sameAs: [
      "https://github.com/airnub",
      "https://www.linkedin.com/company/airnub",
    ],
    contactPoint: [
      {
        telephone: "+1-415-555-0163",
        contactType: "sales",
        email: "hello@airnub.io",
        areaServed: "Global",
        availableLanguage: ["English"],
      },
    ],
  });
}

export function buildAirnubProductPortfolioJsonLd(): JsonLd {
  return itemListJsonLd({
    name: "Airnub product portfolio",
    items: [
      {
        name: "Speckit",
        url: SPECKIT_BASE_URL,
        description: "Developer workflow governance and evidence automation.",
      },
      {
        name: "Platform blueprints",
        url: `${AIRNUB_BASE_URL}${AIRNUB_ROUTES.services}#platform`,
        description: "Reference architectures and paved roads for platform teams.",
      },
      {
        name: "Trust accelerators",
        url: `${AIRNUB_BASE_URL}${AIRNUB_ROUTES.services}#trust`,
        description: "Compliance artifacts with automated evidence capture.",
      },
    ],
  });
}
