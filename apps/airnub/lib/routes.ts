export const AIRNUB_BASE_URL = "https://airnub.io";

export const AIRNUB_ROUTES = {
  home: "/",
  products: "/products",
  solutions: "/solutions",
  services: "/services",
  resources: "/resources",
  trust: "/trust",
  company: "/company",
  contact: "/contact",
} as const;

export type AirnubRouteKey = keyof typeof AIRNUB_ROUTES;
export type AirnubRoute = (typeof AIRNUB_ROUTES)[AirnubRouteKey];

export type NavItem = {
  label: string;
  href: AirnubRoute;
  external?: boolean;
};

export const AIRNUB_NAV_ITEMS: NavItem[] = [
  { label: "Products", href: AIRNUB_ROUTES.products },
  { label: "Solutions", href: AIRNUB_ROUTES.solutions },
  { label: "Services", href: AIRNUB_ROUTES.services },
  { label: "Resources", href: AIRNUB_ROUTES.resources },
  { label: "Trust", href: AIRNUB_ROUTES.trust },
  { label: "Company", href: AIRNUB_ROUTES.company },
  { label: "Contact", href: AIRNUB_ROUTES.contact },
];

export const AIRNUB_SITEMAP_PATHS = [
  "",
  AIRNUB_ROUTES.products,
  AIRNUB_ROUTES.solutions,
  AIRNUB_ROUTES.services,
  AIRNUB_ROUTES.resources,
  AIRNUB_ROUTES.company,
  AIRNUB_ROUTES.contact,
  AIRNUB_ROUTES.trust,
] as const;
