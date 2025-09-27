export const SPECKIT_BASE_URL = "https://speckit.airnub.io";

export const SPECKIT_ROUTES = {
  home: "/",
  product: "/product",
  howItWorks: "/how-it-works",
  solutions: "/solutions",
  solutionsCiso: "/solutions/ciso",
  solutionsDevSecOps: "/solutions/devsecops",
  template: "/template",
  pricing: "/pricing",
  contact: "/contact",
  trust: "/trust",
} as const;

export type SpeckitRouteKey = keyof typeof SPECKIT_ROUTES;
export type SpeckitRoute = (typeof SPECKIT_ROUTES)[SpeckitRouteKey];

export type SpeckitNavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const SPECKIT_NAV_ITEMS: SpeckitNavItem[] = [
  { label: "Product", href: SPECKIT_ROUTES.product },
  { label: "How it works", href: SPECKIT_ROUTES.howItWorks },
  { label: "Solutions", href: SPECKIT_ROUTES.solutions },
  { label: "Docs", href: "https://docs.speckit.dev", external: true },
  { label: "Pricing", href: SPECKIT_ROUTES.pricing },
  { label: "Trust", href: "https://trust.airnub.io", external: true },
];

export const SPECKIT_SITEMAP_PATHS = [
  "",
  SPECKIT_ROUTES.product,
  SPECKIT_ROUTES.howItWorks,
  SPECKIT_ROUTES.solutions,
  SPECKIT_ROUTES.solutionsCiso,
  SPECKIT_ROUTES.solutionsDevSecOps,
  SPECKIT_ROUTES.template,
  SPECKIT_ROUTES.pricing,
  SPECKIT_ROUTES.contact,
  SPECKIT_ROUTES.trust,
] as const;
