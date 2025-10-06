const PRODUCTION_MICROSITE_ORIGINS = {
  adf: "https://adf.airnub.io",
  speckit: "https://speckit.airnub.io",
} as const;

type MicrositeId = keyof typeof PRODUCTION_MICROSITE_ORIGINS;

const ENVIRONMENT_OVERRIDES: Record<MicrositeId, string | undefined> = {
  adf:
    process.env.NEXT_PUBLIC_AIRNUB_ADF_ORIGIN ??
    process.env.AIRNUB_ADF_ORIGIN ??
    undefined,
  speckit:
    process.env.NEXT_PUBLIC_AIRNUB_SPECKIT_ORIGIN ??
    process.env.AIRNUB_SPECKIT_ORIGIN ??
    undefined,
};

const RESOLVED_MICROSITE_ORIGINS: Record<MicrositeId, string> = {
  adf: normalizeOrigin(
    ENVIRONMENT_OVERRIDES.adf ?? PRODUCTION_MICROSITE_ORIGINS.adf,
  ),
  speckit: normalizeOrigin(
    ENVIRONMENT_OVERRIDES.speckit ?? PRODUCTION_MICROSITE_ORIGINS.speckit,
  ),
};

const PRODUCTION_TO_RESOLVED = new Map<string, string>(
  (Object.keys(PRODUCTION_MICROSITE_ORIGINS) as MicrositeId[]).map((id) => [
    PRODUCTION_MICROSITE_ORIGINS[id],
    RESOLVED_MICROSITE_ORIGINS[id],
  ]),
);

function normalizeOrigin(origin: string) {
  const trimmed = origin.trim();
  if (trimmed === "") {
    return trimmed;
  }

  return trimmed.replace(/\/+$/, "");
}

export function getMicrositeOrigin(id: MicrositeId) {
  return RESOLVED_MICROSITE_ORIGINS[id];
}

export function resolveMicrositeHref(href: string) {
  if (typeof href !== "string" || href.length === 0) {
    return href;
  }

  for (const [productionOrigin, resolvedOrigin] of PRODUCTION_TO_RESOLVED) {
    if (href === productionOrigin) {
      return resolvedOrigin;
    }

    if (href.startsWith(`${productionOrigin}/`)) {
      const suffix = href.slice(productionOrigin.length);
      return `${resolvedOrigin}${suffix}`;
    }
  }

  return href;
}

