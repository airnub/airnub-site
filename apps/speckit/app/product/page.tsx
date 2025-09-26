import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Product",
  description: "See how Speckit orchestrates governance across specs, pipelines, and evidence streams.",
};

const pillars = [
  {
    title: "Model",
    description: "Capture architecture decisions, risks, and policy owners in collaborative specs synced to Git.",
  },
  {
    title: "Enforce",
    description: "Apply reusable controls across pipelines, cloud, and service catalogs with explainable results.",
  },
  {
    title: "Prove",
    description: "Generate and distribute evidence to auditors, customers, and leadership automatically.",
  },
];

const integrations = [
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Jira",
  "ServiceNow",
  "PagerDuty",
  "AWS",
  "Azure",
  "GCP",
];

export default function ProductPage() {
  return (
    <div className="space-y-20 pb-20">
      <PageHero
        eyebrow="Product"
        title="One platform to model, enforce, and prove governance"
        description="Speckit connects planning, delivery, and assurance. Ship faster with guardrails that satisfy platform, security, and compliance leaders."
        actions={<Button asChild><Link href="/pricing">See pricing</Link></Button>}
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{pillar.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-start">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white">Speckit timeline</h2>
            <ol className="mt-6 space-y-6 text-sm text-slate-300">
              <li>
                <div className="font-semibold text-white">1. Spec kickoff</div>
                <p className="mt-1">Start with a versioned spec linked to code. Assign approvers and risk posture.</p>
              </li>
              <li>
                <div className="font-semibold text-white">2. Policy orchestration</div>
                <p className="mt-1">Controls run across CI, IaC, and runtime. Exceptions are documented and routed for review.</p>
              </li>
              <li>
                <div className="font-semibold text-white">3. Evidence stream</div>
                <p className="mt-1">SBOMs, attestations, and control proofs sync to Supabase, GRC tools, and customer portals.</p>
              </li>
            </ol>
          </div>
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-xl font-semibold text-white">Integrations that meet you where you work</h3>
              <p className="mt-3 text-sm text-slate-300">
                Use Speckit UI, CLI, or APIs. Bring your own secrets manager, ticketing, and observability stack.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-200">
                {integrations.map((integration) => (
                  <span key={integration} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    {integration}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-xl font-semibold text-white">Shared Supabase data core</h3>
              <p className="mt-3 text-sm text-slate-300">
                Marketing and product forms feed one Supabase project. Row-level security keeps leads private while your GTM and product teams analyze performance.
              </p>
              <p className="mt-3 text-sm text-slate-300">
                Use the service role to sync Speckit evidence to your data warehouse or customer trust portal with confidence.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
