import type { Metadata } from "next";
import { organizationJsonLd, softwareApplicationJsonLd, type JsonLd } from "@airnub/seo";
import type { BrandConfig } from "./brand.config";

const DEFAULT_OG_IMAGE_PATH = "/brand/og.png";
const DEFAULT_ICON_PATH = "/brand/favicon.svg";

function resolveOgImagePath(brand: BrandConfig): string {
  return (
    brand.og ??
    brand.logos.mark ??
    brand.logos.light ??
    brand.favicon ??
    DEFAULT_OG_IMAGE_PATH
  );
}

function resolveIconPath(brand: BrandConfig): string {
  return brand.favicon ?? brand.logos.mark ?? DEFAULT_ICON_PATH;
}

function resolveLogoPath(brand: BrandConfig): string {
  return brand.logos.mark ?? brand.logos.light ?? resolveIconPath(brand);
}

function toAbsoluteUrl(baseUrl: string, value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export function getBrandSocialUrls(brand: BrandConfig): string[] {
  const urls = Object.values(brand.social ?? {}).filter(
    (value): value is string => Boolean(value?.length)
  );
  return Array.from(new Set(urls));
}

export interface BuildBrandMetadataOptions {
  brand: BrandConfig;
  baseUrl: string;
  overrides?: Partial<Metadata>;
}

export function buildBrandMetadata({
  brand,
  baseUrl,
  overrides,
}: BuildBrandMetadataOptions): Metadata {
  const ogImageUrl = toAbsoluteUrl(baseUrl, resolveOgImagePath(brand));
  const iconPath = resolveIconPath(brand);
  const metadataBase = overrides?.metadataBase ?? new URL(baseUrl);

  const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
    title: brand.name,
    description: brand.description,
    url: baseUrl,
    siteName: brand.name,
    type: "website",
    ...(ogImageUrl
      ? {
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: brand.name,
            },
          ],
        }
      : {}),
  };

  const defaultTwitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title: brand.name,
    description: brand.description,
    ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
  };

  const {
    openGraph: openGraphOverrides,
    twitter: twitterOverrides,
    icons: iconOverrides,
    metadataBase: _metadataBaseOverride,
    title: titleOverride,
    description: descriptionOverride,
    ...restOverrides
  } = overrides ?? {};

  return {
    metadataBase,
    title: titleOverride ?? brand.name,
    description: descriptionOverride ?? brand.description,
    openGraph: {
      ...defaultOpenGraph,
      ...openGraphOverrides,
      ...(openGraphOverrides?.images
        ? { images: openGraphOverrides.images }
        : defaultOpenGraph.images
          ? { images: defaultOpenGraph.images }
          : {}),
    },
    twitter: {
      ...defaultTwitter,
      ...twitterOverrides,
      ...(twitterOverrides?.images
        ? { images: twitterOverrides.images }
        : defaultTwitter.images
          ? { images: defaultTwitter.images }
          : {}),
    },
    icons: iconOverrides ?? { icon: iconPath },
    ...restOverrides,
  } satisfies Metadata;
}

type OrganizationJsonLdOptions = Parameters<typeof organizationJsonLd>[0];

export interface BuildBrandOrganizationJsonLdOptions {
  brand: BrandConfig;
  baseUrl: string;
  overrides?: {
    name?: string;
    url?: string;
    logo?: string;
    sameAs?: string[];
    contactPoint?: NonNullable<OrganizationJsonLdOptions["contactPoint"]>;
  };
}

export function buildBrandOrganizationJsonLd({
  brand,
  baseUrl,
  overrides,
}: BuildBrandOrganizationJsonLdOptions): JsonLd {
  const logo = toAbsoluteUrl(baseUrl, overrides?.logo ?? resolveLogoPath(brand));
  const sameAs = overrides?.sameAs ?? getBrandSocialUrls(brand);

  return organizationJsonLd({
    name: overrides?.name ?? brand.name,
    url: overrides?.url ?? baseUrl,
    ...(logo ? { logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(overrides?.contactPoint ? { contactPoint: overrides.contactPoint } : {}),
  });
}

type SoftwareApplicationJsonLdOptions = Parameters<typeof softwareApplicationJsonLd>[0];

export interface BuildBrandSoftwareApplicationJsonLdOptions {
  brand: BrandConfig;
  baseUrl: string;
  applicationCategory: SoftwareApplicationJsonLdOptions["applicationCategory"];
  overrides?: Partial<Omit<SoftwareApplicationJsonLdOptions, "name" | "url" | "applicationCategory" >>;
}

export function buildBrandSoftwareApplicationJsonLd({
  brand,
  baseUrl,
  applicationCategory,
  overrides,
}: BuildBrandSoftwareApplicationJsonLdOptions): JsonLd {
  const ogImage = overrides?.image ?? resolveOgImagePath(brand);
  const image = toAbsoluteUrl(baseUrl, ogImage);
  const sameAs = overrides?.sameAs ?? getBrandSocialUrls(brand);

  return softwareApplicationJsonLd({
    name: brand.name,
    url: baseUrl,
    applicationCategory,
    ...(overrides?.operatingSystem ? { operatingSystem: overrides.operatingSystem } : {}),
    description: overrides?.description ?? brand.description,
    ...(image ? { image } : {}),
    ...(overrides?.offers ? { offers: overrides.offers } : {}),
    ...(overrides?.aggregateRating ? { aggregateRating: overrides.aggregateRating } : {}),
    ...(overrides?.softwareHelp ? { softwareHelp: overrides.softwareHelp } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  });
}
