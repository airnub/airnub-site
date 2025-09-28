import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const revalidate = 604_800;

export const metadata: Metadata = {
  title: "Rollout template",
  description: "Kickstart your Speckit implementation with a ready-to-run rollout plan.",
};

const steps = [
  {
    title: "Week 1 — Discovery",
    description: "Map current controls, tooling, and evidence flows. Identify pilot teams and success metrics.",
  },
  {
    title: "Weeks 2-3 — Orchestration",
    description: "Configure Supabase, connect repos, and codify policy gates in pipelines and IaC.",
  },
  {
    title: "Weeks 4-5 — Enablement",
    description: "Enable teams with templates, guardrail playbooks, and evidence dashboards.",
  },
  {
    title: "Week 6 — Scale",
    description: "Review KPIs, expand to additional services, and integrate evidence feeds into trust portals.",
  },
];

export default function TemplatePage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Template"
        title="A proven rollout playbook"
        description="Download the six-week plan Speckit uses to launch with platform, security, and compliance teams."
        actions={
          <Link
            href="https://github.com/airnub/speckit-templates"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Get the template
          </Link>
        }
      />

      <section>
        <Container className="grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/10"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </Container>
      </section>
    </div>
  );
}
