import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../../../components/PageHero";
import { JsonLd } from "../../../components/JsonLd";
import { buildAirnubProductPortfolioJsonLd } from "../../../lib/jsonld";
import { LocaleLink } from "../../../components/LocaleLink";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Products",
  description: "Discover Airnub offerings including Speckit, reference architectures, and trust accelerators.",
};

const offerings = [
  {
    name: "Speckit",
    description: "Policy-driven delivery controls, SBOM management, and evidence automation for platform teams.",
    href: "https://speckit.airnub.io",
    badge: "Flagship",
  },
  {
    name: "Platform blueprints",
    description: "Cloud landing zones, golden paths, and service catalogs aligned to regulated industries.",
    href: "/services#platform",
    badge: "New",
  },
  {
    name: "Trust accelerators",
    description: "SOC 2, ISO 27001, and FedRAMP readiness kits bundled with evidence automations.",
    href: "/services#trust",
  },
];

const jsonLd = buildAirnubProductPortfolioJsonLd();

export default function ProductsPage() {
  return (
    <div className="space-y-16 pb-24 text-slate-300">
      <PageHero
        eyebrow="Products"
        title="Everything you need to govern modern software delivery"
        description="Airnub packages products, playbooks, and trusted services to help platform teams scale without slowing down developers."
        actions={<Button asChild><LocaleLink href="/contact">Schedule a demo</LocaleLink></Button>}
      />

      <section>
        <Container className="grid gap-8 md:grid-cols-2">
          {offerings.map((offering) => (
            <article
              key={offering.name}
              className="flex h-full flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-white">{offering.name}</h2>
                  {offering.badge ? (
                    <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
                      {offering.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-slate-300">{offering.description}</p>
              </div>
              <div className="mt-8">
                {(() => {
                  const isExternal = offering.href.startsWith("http");
                  const LinkComponent = isExternal ? Link : LocaleLink;
                  const linkProps = isExternal
                    ? { target: "_blank", rel: "noreferrer" as const }
                    : {};
                  return (
                    <LinkComponent
                      href={offering.href}
                      className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
                      {...linkProps}
                    >
                      Learn more →
                    </LinkComponent>
                  );
                })()}
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg shadow-slate-950/40">
            <h3 className="text-xl font-semibold text-white">Built with trust as a feature</h3>
            <p className="mt-3 text-sm text-slate-300">
              Every product ships with compliance guardrails, audit-ready evidence, and API-first integrations that slot into your delivery stack.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>→ SLSA-aligned attestations and SBOM automation</li>
              <li>→ Role-aware workflows for platform, security, and compliance leads</li>
              <li>→ Open APIs and adapters for the tools you already use</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg shadow-slate-950/40">
            <h3 className="text-xl font-semibold text-white">Shared Supabase foundations</h3>
            <p className="mt-3 text-sm text-slate-300">
              Both the Airnub corporate site and Speckit microsite capture leads into the same Supabase project, keeping GTM signals aligned and secure.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Row-level security ensures visitor submissions stay private while platform teams can analyze performance via service-role access.
            </p>
          </div>
        </Container>
      </section>

      <JsonLd data={jsonLd} />
    </div>
  );
}
