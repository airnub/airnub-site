import {
  buildBrandOrganizationJsonLd,
  resolvedBrandConfig as airnubBrand,
} from "@airnub/brand";
import { itemListJsonLd } from "@airnub/seo";
import { AIRNUB_BASE_URL } from "./routes";

export function buildAirnubOrganizationJsonLd() {
  const sameAs = [airnubBrand.social.github, airnubBrand.social.linkedin].filter(
    (url): url is string => Boolean(url)
  );

  const salesEmail = airnubBrand.contact.sales ?? airnubBrand.contact.general;
  const securityEmail = airnubBrand.contact.security;
  const pressEmail = airnubBrand.contact.press;

  return buildBrandOrganizationJsonLd({
    brand: airnubBrand,
    baseUrl: AIRNUB_BASE_URL,
    overrides: {
      sameAs,
      contactPoint: [
        salesEmail
          ? {
              "@type": "ContactPoint",
              contactType: "sales",
              email: salesEmail,
              availableLanguage: ["English"],
              areaServed: "Global",
            }
          : undefined,
        securityEmail
          ? {
              "@type": "ContactPoint",
              contactType: "security",
              email: securityEmail,
            }
          : undefined,
        pressEmail
          ? {
              "@type": "ContactPoint",
              contactType: "press",
              email: pressEmail,
            }
          : undefined,
      ].filter((point): point is NonNullable<typeof point> => Boolean(point)),
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
