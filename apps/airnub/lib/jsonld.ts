import { brand as airnubBrand } from "@airnub/brand";
import { itemListJsonLd, organizationJsonLd } from "@airnub/seo";
import { AIRNUB_BASE_URL } from "./routes";

export function buildAirnubOrganizationJsonLd() {
  const logoPath =
    airnubBrand.logos.mark ?? airnubBrand.logos.light ?? airnubBrand.favicon ?? "/brand/logo.svg";
  const logoUrl = new URL(logoPath, AIRNUB_BASE_URL).toString();
  return organizationJsonLd({
    name: "Airnub",
    url: AIRNUB_BASE_URL,
    logo: logoUrl,
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
