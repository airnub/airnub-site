import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { itemListJsonLd } from "@airnub/seo";
import { PageHero } from "../../components/PageHero";
import { JsonLd } from "../../components/JsonLd";

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

const jsonLd = itemListJsonLd({
  name: "Airnub product portfolio",
  items: [
    {
      name: "Speckit",
      url: "https://speckit.airnub.io",
      description: "Developer workflow governance and evidence automation.",
    },
    {
      name: "Platform blueprints",
      url: "https://airnub.io/services#platform",
      description: "Reference architectures and paved roads for platform teams.",
    },
    {
      name: "Trust accelerators",
      url: "https://airnub.io/services#trust",
      description: "Compliance artifacts with automated evidence capture.",
    },
  ],
});

export default function ProductsPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Products"
        title="Everything you need to govern modern software delivery"
        description="Airnub packages products, playbooks, and trusted services to help platform teams scale without slowing down developers."
        actions={<Button asChild><Link href="/contact">Schedule a demo</Link></Button>}
      />

      <section>
        <Container className="grid gap-8 md:grid-cols-2">
          {offerings.map((offering) => (
            <article key={offering.name} className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-slate-900">{offering.name}</h2>
                  {offering.badge ? (
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                      {offering.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-slate-600">{offering.description}</p>
              </div>
              <div className="mt-8">
                <Link
                  href={offering.href}
                  className="text-sm font-semibold text-sky-600 hover:text-sky-500"
                  target={offering.href.startsWith("http") ? "_blank" : undefined}
                  rel={offering.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  Learn more →
                </Link>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Built with trust as a feature</h3>
            <p className="mt-3 text-sm text-slate-600">
              Every product ships with compliance guardrails, audit-ready evidence, and API-first integrations that slot into your delivery stack.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>→ SLSA-aligned attestations and SBOM automation</li>
              <li>→ Role-aware workflows for platform, security, and compliance leads</li>
              <li>→ Open APIs and adapters for the tools you already use</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Shared Supabase foundations</h3>
            <p className="mt-3 text-sm text-slate-600">
              Both the Airnub corporate site and Speckit microsite capture leads into the same Supabase project, keeping GTM signals aligned and secure.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Row-level security ensures visitor submissions stay private while platform teams can analyze performance via service-role access.
            </p>
          </div>
        </Container>
      </section>
      <JsonLd data={jsonLd} />
    </div>
  );
}
