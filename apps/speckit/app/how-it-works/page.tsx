import type { Metadata } from "next";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const revalidate = 604_800;

export const metadata: Metadata = {
  title: "How it works",
  description: "Understand the Speckit lifecycle from spec capture to evidence distribution.",
};

const stages = [
  {
    name: "Capture",
    description: "Specs start in Git-backed docs. Risk, controls, and approvers are defined at the beginning, not the end.",
  },
  {
    name: "Orchestrate",
    description: "Controls trigger across pipelines and environments. Exceptions kick off review workflows automatically.",
  },
  {
    name: "Publish",
    description: "Evidence lands where it is needed — Supabase, GRC tools, customer trust portals, and analytics stacks.",
  },
];

const audiences = [
  {
    role: "Platform",
    value: "Golden paths with governance built-in. No more waiting for approvals or chasing down sign-offs.",
  },
  {
    role: "Security",
    value: "Policy-as-code with transparency. Audit every control execution and exception trail.",
  },
  {
    role: "Compliance",
    value: "Evidence on demand. Dashboards map controls to frameworks and highlight gaps instantly.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="How it works"
        title="A continuous loop that brings trust into daily delivery"
        description="Speckit unites planning, shipping, and proving. Every step is automated, traceable, and designed for collaboration."
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <div
              key={stage.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/10"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                Step {index + 1}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{stage.name}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{stage.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-white/10 dark:bg-white/10">
          <div className="grid gap-8 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience.role}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-950/40"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{audience.role}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{audience.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 shadow-xl dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Bring your own tooling</h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Speckit integrates via webhooks, REST APIs, and SDKs. Use our Supabase adapters to sync data across environments with RLS intact.
          </p>
          <ul className="mt-6 grid gap-4 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-2">
            <li>→ GitHub Actions, CircleCI, GitLab pipelines</li>
            <li>→ Terraform, Pulumi, CloudFormation</li>
            <li>→ ServiceNow, Jira, Linear workflow updates</li>
            <li>→ Supabase, Snowflake, and customer trust portals</li>
          </ul>
        </Container>
      </section>
    </div>
  );
}
