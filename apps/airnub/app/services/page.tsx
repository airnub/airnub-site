import type { Metadata } from "next";
import { Button, Container } from "@airnub/ui";
import Link from "next/link";
import { PageHero } from "../../components/PageHero";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Services",
  description: "Advisory and enablement services that align platform strategy, delivery, and compliance outcomes.",
};

const engagements = [
  {
    id: "platform",
    title: "Platform operating model",
    description: "Align platform, security, and compliance teams with clear swimlanes, OKRs, and governance rituals.",
    deliverables: [
      "Capability maturity assessment",
      "Org design and accountability map",
      "Roadmap with quarterly OKRs",
    ],
  },
  {
    id: "blueprint",
    title: "Landing zone & golden path design",
    description: "Reference architectures, IaC, and policies that bootstrap developer experience with guardrails.",
    deliverables: [
      "Regulated-ready cloud baseline",
      "Service catalog and starter kits",
      "Policy-as-code controls mapped to frameworks",
    ],
  },
  {
    id: "trust",
    title: "Trust & assurance readiness",
    description: "Automate evidence capture and streamline audits with Speckit-powered workflows.",
    deliverables: [
      "Evidence catalog and control narratives",
      "SBOM, attestation, and RTM automation",
      "Audit rehearsal and stakeholder enablement",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Services"
        title="Embedded experts for every stage of your platform journey"
        description="We combine product thinking with compliance and platform engineering so you can unlock reliable, trusted delivery."
        actions={<Button asChild><Link href="/contact">Book an intro call</Link></Button>}
      />

      <section>
        <Container className="space-y-10">
          {engagements.map((engagement) => (
            <article key={engagement.id} id={engagement.id} className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:max-w-2xl">
                  <h2 className="text-2xl font-semibold text-slate-900">{engagement.title}</h2>
                  <p className="mt-3 text-sm text-slate-600">{engagement.description}</p>
                </div>
                <div className="lg:min-w-[16rem]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Key deliverables</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {engagement.deliverables.map((item) => (
                      <li key={item}>→ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-slate-900 p-10 text-slate-100">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Outcomes-first engagements</h2>
              <p className="mt-4 text-sm text-slate-300">
                We align each engagement to measurable KPIs: deployment frequency, change failure rate, audit readiness time, and customer trust metrics.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
              <p className="text-sm text-slate-200">We embed alongside your teams for 6–12 weeks, transfer knowledge continuously, and operationalize Speckit for long-term success.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
