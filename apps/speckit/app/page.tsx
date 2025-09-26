import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "End vibe-coding. Ship secure, auditable releases.",
};

const features = [
  {
    title: "Governed spec loop",
    description: "Model architecture decisions, risk reviews, and policy checks in a living spec that maps to every commit.",
  },
  {
    title: "Policy gates",
    description: "Codify approvals across CI/CD, infrastructure, and runtime with reusable controls and transparent history.",
  },
  {
    title: "Continuous evidence",
    description: "Generate SBOMs, attestations, and RTMs automatically so audits, customer reviews, and leadership updates are no-drama.",
  },
];

const workflows = [
  {
    name: "Risk-aware release approvals",
    description: "Dynamic checklists tied to spec changes, risk posture, and policy owners.",
  },
  {
    name: "Supply chain attestation",
    description: "SLSA-aligned attestations from source to deploy, with artifact lineage graphing.",
  },
  {
    name: "Control reporting",
    description: "Real-time dashboards for SOC 2, ISO 27001, HIPAA, and FedRAMP evidence gaps.",
  },
];

export default function SpeckitHome() {
  return (
    <div className="space-y-24 pb-24">
      <PageHero
        eyebrow="Speckit"
        title="End vibe-coding. Ship secure, auditable releases."
        description="Speckit turns compliance from a scramble into a continuous, developer-native loop. Govern specs, orchestrate policy gates, and ship evidence on demand."
        actions={
          <>
            <Button asChild>
              <Link href="/contact">Request a demo</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="https://docs.speckit.dev" target="_blank" rel="noreferrer">
                Explore docs
              </Link>
            </Button>
          </>
        }
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[3fr,2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-white">Speckit centralizes governance without slowing flow</h2>
            <p className="mt-4 text-base text-slate-300">
              Replace spreadsheets, ad hoc approvals, and one-off attestations. Speckit codifies governance into developer workflows, then feeds evidence to the people and systems that need it.
            </p>
            <div className="mt-6 grid gap-4">
              {workflows.map((workflow) => (
                <div key={workflow.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">{workflow.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_55%)]" aria-hidden="true" />
            <div className="relative space-y-6 text-sm text-slate-200">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Guardrail snapshot</p>
                <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">Spec change → Release</p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-300">
                    <li>✔ Architecture review signed by Platform</li>
                    <li>✔ Security controls verified against CIS profiles</li>
                    <li>⚡ SBOM + attestation generated in pipeline</li>
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Evidence stream</p>
                <div className="mt-3 space-y-2 text-xs text-slate-200">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span>RTM update</span>
                    <span className="text-indigo-300">Live</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span>FedRAMP AC-3 control</span>
                    <span className="text-indigo-300">Pass</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <span>SLSA attestation</span>
                    <span className="text-indigo-300">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-white/10 bg-white/10 p-10 shadow-xl">
          <div className="grid gap-10 lg:grid-cols-[2fr,3fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white">All teams see the same source of truth</h2>
              <p className="mt-4 text-base text-slate-200">
                Platform, security, compliance, and product leaders collaborate in a shared context. Speckit syncs with GitHub, Jira, ServiceNow, and Supabase so your data stays where work already happens.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/how-it-works">See how it works</Link>
                </Button>
                <Button asChild>
                  <Link href="/template">Download rollout template</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">Spec-first workflows</h3>
                <p className="mt-2 text-sm text-slate-300">Tie every requirement to implementation and validation in one place.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">Compliance-ready APIs</h3>
                <p className="mt-2 text-sm text-slate-300">Push evidence to GRC suites, customer trust portals, and ticketing systems.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">Shared Supabase core</h3>
                <p className="mt-2 text-sm text-slate-300">Marketing and product leads flow into one RLS-protected Supabase dataset.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">Developer-native UX</h3>
                <p className="mt-2 text-sm text-slate-300">CLI, GitHub Actions, and APIs that meet engineers in their existing workflows.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">Works with your stack</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-300">
            {[
              "GitHub",
              "GitLab",
              "Jira",
              "ServiceNow",
              "Supabase",
              "AWS",
              "Azure",
            ].map((logo) => (
              <div key={logo} className="flex h-16 w-36 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <span className="text-sm font-semibold text-slate-200">{logo}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
