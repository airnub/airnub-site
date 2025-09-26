import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../../components/PageHero";

export const revalidate = 604_800;

export const metadata: Metadata = {
  title: "Solutions for CISOs",
  description: "Give CISOs continuous assurance with automated controls, evidence, and reporting.",
};

const outcomes = [
  "Live control status mapped to SOC 2, ISO 27001, HIPAA, and FedRAMP",
  "Automated SSP narratives and customer trust report feeds",
  "Evidence retention policies backed by Supabase row-level security",
];

export default function CisoSolutionsPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Solutions"
        title="Continuous compliance without manual scramble"
        description="Speckit gives CISOs real-time visibility into control posture, exceptions, and audit readiness."
      />

      <section>
        <Container className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Why CISOs choose Speckit</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            {outcomes.map((outcome) => (
              <li key={outcome}>→ {outcome}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Deliverables</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Control automation</h3>
              <p className="mt-2">Codified guardrails for change management, access reviews, vulnerability management, and incident response.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Executive reporting</h3>
              <p className="mt-2">Dashboards for board and customer updates with drill-down evidence trails.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
