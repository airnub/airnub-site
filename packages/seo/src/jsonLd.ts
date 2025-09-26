export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(options: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string[];
  }[];
}): JsonLd {
  const { name, url, logo, sameAs = [], contactPoint = [] } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(contactPoint.length ? { contactPoint } : {}),
  };
}

export function itemListJsonLd(options: {
  name: string;
  items: { name: string; url: string; description?: string }[];
}): JsonLd {
  const { name, items } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function softwareApplicationJsonLd(options: {
  name: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: JsonLd;
  aggregateRating?: JsonLd;
  softwareHelp?: string;
  image?: string;
  description?: string;
  sameAs?: string[];
}): JsonLd {
  const { name, url, applicationCategory, operatingSystem = 'Web', offers, aggregateRating, softwareHelp, image, description, sameAs = [] } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url,
    applicationCategory,
    operatingSystem,
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(offers ? { offers } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(softwareHelp ? { softwareHelp: { '@type': 'CreativeWork', url: softwareHelp } } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function jsonLdScriptTag(json: JsonLd): string {
  return `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
}
