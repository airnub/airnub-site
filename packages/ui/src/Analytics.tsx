'use client';
import Script from 'next/script';

export default function Analytics({ provider, domain, gaId }:{provider?:'plausible'|'ga4'|'off',domain?:string,gaId?:string}) {
  if (provider === 'plausible' && domain) {
    return <Script defer data-domain={domain} src="https://plausible.io/js/script.js" />;
  }
  if (provider === 'ga4' && gaId) {
    return <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
  }
  return null;
}
