'use client';
import Script from 'next/script';

type AnalyticsProvider = 'plausible' | 'ga4';

function normalizeProvider(provider?: string | null): AnalyticsProvider | null {
  if (!provider) {
    return null;
  }
  const normalized = provider.toLowerCase();
  if (normalized === 'plausible' || normalized === 'ga4') {
    return normalized;
  }
  return null;
}

export default function Analytics({
  provider,
  domain,
  gaId,
}: {
  provider?: string | null;
  domain?: string;
  gaId?: string;
}) {
  const normalized = normalizeProvider(provider);

  if (normalized === 'plausible') {
    if (!domain) {
      return null;
    }
    return <Script defer data-domain={domain} src="https://plausible.io/js/script.js" />;
  }

  if (normalized === 'ga4') {
    if (!gaId) {
      return null;
    }
    return <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />;
  }

  return null;
}
