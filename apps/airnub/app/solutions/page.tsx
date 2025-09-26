import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Industry-specific pathways to govern developer platforms for financial services, public sector, and SaaS.",
};

const sectors = [
  {
    name: "Financial services",
    summary: "Balance product speed with FFIEC, PCI DSS, and SOX mandates.",
    bullets: [
      "Golden paths for high-trust workloads",
      "Evidence automation for auditors and regulators",
      "Change control aligned to core banking systems",
    ],
  },
  {
    name: "Public sector",
    summary: "Accelerate FedRAMP and StateRAMP initiatives with repeatable guardrails.",
    bullets: [
      "Compliance-aligned landing zones",
      "Automated SSP control narratives",
      "Multi-tenancy models with attestation support",
    ],
  },
  {
    name: "Enterprise SaaS",
    summary: "Ship confidently across regions while meeting SOC 2, ISO 27001, and HIPAA expectations.",
    bullets: [
      "Platform operating models for scale",
      "Service catalogs with embedded guardrails",
      "Runtime policy enforcement across CI/CD and runtime",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Solutions"
        title="Governance blueprints tailored to your sector"
        description="Airnub pairs platform expertise with regulatory insight so you can design, operate, and scale with clarity."
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {sectors.map((sector) => (
            <div key={sector.name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{sector.name}</h2>
              <p className="mt-3 text-sm text-slate-600">{sector.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {sector.bullets.map((bullet) => (
                  <li key={bullet}>→ {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-slate-100">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Partner with platform strategists and compliance engineers</h2>
              <p className="mt-4 text-sm text-slate-300">
                Our cross-functional pods pair product, platform, and trust roles to deliver value from the first sprint. We co-design operating models, deliver automation, and upskill your teams.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-sm text-slate-200">
              <p className="font-semibold text-white">What to expect:</p>
              <ul className="mt-3 space-y-2">
                <li>→ Capability assessments mapped to maturity curves</li>
                <li>→ Evidence-as-code automations using Supabase and open standards</li>
                <li>→ Embedded enablement that leaves your teams empowered</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
