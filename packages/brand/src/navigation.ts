import type { BrandContacts } from "./brand.config";
import { getMicrositeOrigin } from "./microsites";

export type NavigationLinkDefinition = {
  /**
   * Unique identifier for the navigation link. This value is stable across locales
   * so translation tables can reference it.
   */
  id: string;
  /**
   * Translation key used to resolve the localized label. Keys follow a
   * "namespace.path" pattern (e.g. `nav.products`).
   */
  labelKey: string;
  /**
   * Base href for the link. Applications may adapt this (e.g. inject the locale)
   * before rendering.
   */
  href: string;
  /**
   * When true the link opens in a new tab and is treated as external.
   */
  external?: boolean;
};

export type HeaderNavigationDefinition = NavigationLinkDefinition[];

export type FooterGroupDefinition = {
  /** Stable identifier for the footer group. */
  id: string;
  /** Translation key for the group heading (namespace included). */
  headingKey: string;
  /** Links rendered inside the group. */
  links: NavigationLinkDefinition[];
};

export type ContactHrefType = "mailto" | "tel";

export type DefaultCtaDefinition = {
  /** Stable identifier for the CTA. */
  id: string;
  /** Translation key used to resolve the CTA label (namespace included). */
  labelKey: string;
  /** Optional base href for the CTA. */
  href?: string;
  /** Marks the CTA as external when rendered. */
  external?: boolean;
  /**
   * Contact-driven CTAs can look up a value from the brand contacts configuration.
   * The first defined contact value is used.
   */
  contact?: {
    /** Ordered list of contact keys to try. */
    keys: (keyof BrandContacts)[];
    /** How to transform the contact value into an href. Defaults to `mailto`. */
    hrefType?: ContactHrefType;
    /** Optional translation parameter keys that should receive the contact value. */
    translationParamKeys?: string[];
  };
};

export type SiteNavigationDefinition = {
  header: HeaderNavigationDefinition;
  footer: {
    groups: FooterGroupDefinition[];
    ctas: DefaultCtaDefinition[];
  };
};

export const airnubNavigation: SiteNavigationDefinition = {
  header: [
    { id: "products", labelKey: "nav.products", href: "/products" },
    { id: "adf", labelKey: "nav.adf", href: getMicrositeOrigin("adf") },
    { id: "solutions", labelKey: "nav.solutions", href: "/solutions" },
    { id: "services", labelKey: "nav.services", href: "/services" },
    { id: "resources", labelKey: "nav.resources", href: "/resources" },
    { id: "trust", labelKey: "nav.trust", href: "/trust" },
    { id: "company", labelKey: "nav.company", href: "/company" },
    { id: "contact", labelKey: "nav.contact", href: "/contact" },
  ],
  footer: {
    groups: [
      {
        id: "products",
        headingKey: "footer.columns.products.heading",
        links: [
          {
            id: "products.speckit",
            labelKey: "footer.columns.products.links.speckit",
            href: "https://speckit.airnub.io",
            external: true,
          },
          {
            id: "products.adf",
            labelKey: "footer.columns.products.links.adf",
            href: "https://adf.airnub.io",
            external: true,
          },
        ],
      },
      {
        id: "resources",
        headingKey: "footer.columns.resources.heading",
        links: [
          {
            id: "resources.docs",
            labelKey: "footer.columns.resources.links.docs",
            href: "https://airnub.github.io/speckit/",
            external: true,
          },
          {
            id: "resources.adfDocs",
            labelKey: "footer.columns.resources.links.adfDocs",
            href: "https://airnub.github.io/agentic-delivery-framework/",
            external: true,
          },
          {
            id: "resources.blog",
            labelKey: "footer.columns.resources.links.blog",
            href: "/resources#blog",
          },
          {
            id: "resources.changelog",
            labelKey: "footer.columns.resources.links.changelog",
            href: "/resources#changelog",
          },
        ],
      },
      {
        id: "openSource",
        headingKey: "footer.columns.openSource.heading",
        links: [
          {
            id: "openSource.org",
            labelKey: "footer.columns.openSource.links.org",
            href: "https://github.com/airnub",
            external: true,
          },
          {
            id: "openSource.speckit",
            labelKey: "footer.columns.openSource.links.speckit",
            href: "https://github.com/airnub/speckit",
            external: true,
          },
          {
            id: "openSource.templates",
            labelKey: "footer.columns.openSource.links.templates",
            href: "https://github.com/airnub/landing-zones",
            external: true,
          },
        ],
      },
      {
        id: "trust",
        headingKey: "footer.columns.trust.heading",
        links: [
          {
            id: "trust.trustCenter",
            labelKey: "footer.columns.trust.links.trustCenter",
            href: "https://trust.airnub.io",
            external: true,
          },
          {
            id: "trust.vdp",
            labelKey: "footer.columns.trust.links.vdp",
            href: "https://trust.airnub.io/vdp",
            external: true,
          },
          {
            id: "trust.securityTxt",
            labelKey: "footer.columns.trust.links.securityTxt",
            href: "https://trust.airnub.io/.well-known/security.txt",
            external: true,
          },
        ],
      },
      {
        id: "company",
        headingKey: "footer.columns.company.heading",
        links: [
          {
            id: "company.about",
            labelKey: "footer.columns.company.links.about",
            href: "/company",
          },
          {
            id: "company.careers",
            labelKey: "footer.columns.company.links.careers",
            href: "/company#careers",
          },
          {
            id: "company.press",
            labelKey: "footer.columns.company.links.press",
            href: "/company#press",
          },
          {
            id: "company.legal",
            labelKey: "footer.columns.company.links.legal",
            href: "/company#legal",
          },
        ],
      },
    ],
    ctas: [
      {
        id: "privacy",
        labelKey: "footer.bottom.privacy",
        href: "/company#privacy",
      },
      {
        id: "terms",
        labelKey: "footer.bottom.terms",
        href: "/company#terms",
      },
      {
        id: "contactEmail",
        labelKey: "footer.bottom.email",
        contact: {
          keys: ["sales", "support", "general"],
          hrefType: "mailto",
          translationParamKeys: ["email"],
        },
      },
    ],
  },
} as const satisfies SiteNavigationDefinition;

export const speckitNavigation: SiteNavigationDefinition = {
  header: [
    { id: "product", labelKey: "layout.nav.product", href: "/product" },
    { id: "quickstart", labelKey: "layout.nav.quickstart", href: "/quickstart" },
    { id: "howItWorks", labelKey: "layout.nav.howItWorks", href: "/how-it-works" },
    { id: "solutions", labelKey: "layout.nav.solutions", href: "/solutions" },
    {
      id: "docs",
      labelKey: "layout.nav.docs",
      href: "https://airnub.github.io/speckit/",
      external: true,
    },
    { id: "pricing", labelKey: "layout.nav.pricing", href: "/pricing" },
    {
      id: "trust",
      labelKey: "layout.nav.trust",
      href: "https://trust.airnub.io",
      external: true,
    },
    { id: "contact", labelKey: "layout.nav.contact", href: "/contact" },
  ],
  footer: {
    groups: [
      {
        id: "product",
        headingKey: "layout.footer.columns.product.heading",
        links: [
          {
            id: "product.overview",
            labelKey: "layout.footer.columns.product.overview",
            href: "/",
          },
          {
            id: "product.howItWorks",
            labelKey: "layout.footer.columns.product.howItWorks",
            href: "/how-it-works",
          },
          {
            id: "product.integrations",
            labelKey: "layout.footer.columns.product.integrations",
            href: "/product#integrations",
          },
        ],
      },
      {
        id: "resources",
        headingKey: "layout.footer.columns.resources.heading",
        links: [
          {
            id: "resources.quickstart",
            labelKey: "layout.footer.columns.resources.quickstart",
            href: "/quickstart",
          },
          {
            id: "resources.docs",
            labelKey: "layout.footer.columns.resources.docs",
            href: "https://airnub.github.io/speckit/",
            external: true,
          },
          {
            id: "resources.apiReference",
            labelKey: "layout.footer.columns.resources.apiReference",
            href: "https://airnub.github.io/speckit/api/",
            external: true,
          },
          {
            id: "resources.community",
            labelKey: "layout.footer.columns.resources.community",
            href: "https://github.com/airnub/speckit/discussions",
            external: true,
          },
        ],
      },
      {
        id: "openSource",
        headingKey: "layout.footer.columns.openSource.heading",
        links: [
          {
            id: "openSource.repo",
            labelKey: "layout.footer.columns.openSource.repo",
            href: "https://github.com/airnub/speckit",
            external: true,
          },
          {
            id: "openSource.templates",
            labelKey: "layout.footer.columns.openSource.templates",
            href: "https://github.com/airnub/speckit-templates",
            external: true,
          },
          {
            id: "openSource.issues",
            labelKey: "layout.footer.columns.openSource.issues",
            href: "https://github.com/airnub/speckit/issues",
            external: true,
          },
          {
            id: "openSource.license",
            labelKey: "layout.footer.columns.openSource.license",
            href: "https://github.com/airnub/speckit/blob/main/LICENSE",
            external: true,
          },
        ],
      },
      {
        id: "trust",
        headingKey: "layout.footer.columns.trust.heading",
        links: [
          {
            id: "trust.trustCenter",
            labelKey: "layout.footer.columns.trust.trustCenter",
            href: "https://trust.airnub.io",
            external: true,
          },
          {
            id: "trust.status",
            labelKey: "layout.footer.columns.trust.status",
            href: "https://status.airnub.io",
            external: true,
          },
          {
            id: "trust.securityTxt",
            labelKey: "layout.footer.columns.trust.securityTxt",
            href: "https://trust.airnub.io/.well-known/security.txt",
            external: true,
          },
        ],
      },
    ],
    ctas: [
      {
        id: "contactEmail",
        labelKey: "layout.footer.contact.label",
        contact: {
          keys: ["product", "general", "support"],
          hrefType: "mailto",
          translationParamKeys: ["contactEmail", "email", "productEmail"],
        },
      },
      {
        id: "pricing",
        labelKey: "layout.footer.contact.pricing",
        href: "/pricing",
      },
    ],
  },
} as const satisfies SiteNavigationDefinition;
