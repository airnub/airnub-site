import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../../components/PageHero";

export const revalidate = 604_800;

export const metadata: Metadata = {
  title: "Solutions for DevSecOps",
  description: "Empower DevSecOps to embed guardrails and evidence in every pipeline.",
};

const benefits = [
  "Policy-as-code modules for GitHub Actions, GitLab CI, and Jenkins",
  "Runtime attestations linked to environments and deployments",
  "Service catalogs with self-serve golden paths and guardrails",
];

export default function DevSecOpsSolutionsPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Solutions"
        title="Guardrails and speed for every delivery team"
        description="Speckit gives DevSecOps teams programmable controls, observability, and shared context with security and compliance."
      />

      <section>
        <Container className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">What DevSecOps gains</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            {benefits.map((benefit) => (
              <li key={benefit}>→ {benefit}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Key capabilities</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Workflow adapters</h3>
              <p className="mt-2">Drop-in actions, templates, and CLI commands for pipelines and infrastructure.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Observability hooks</h3>
              <p className="mt-2">Send control results to Datadog, Grafana, or Slack with deep links into evidence.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
