import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const revalidate = 21_600;

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides, changelog, and enablement materials that help platform teams operationalize trust.",
};

const guides = [
  {
    title: "Platform governance playbook",
    description: "A practical guide to designing guardrails without slowing product teams.",
    href: "https://airnub.io/resources#governance-playbook",
  },
  {
    title: "SLSA-aligned delivery checklist",
    description: "Steps to implement supply chain security from source to runtime.",
    href: "https://airnub.io/resources#slsa",
  },
  {
    title: "Evidence-as-code starter",
    description: "Codify audit artifacts with Supabase, GitHub Actions, and Speckit.",
    href: "https://airnub.io/resources#evidence",
  },
];

const updates = [
  {
    title: "Speckit v0.8 adds drift-aware attestations",
    date: "June 2024",
    href: "https://speckit.airnub.io/changelog",
  },
  {
    title: "How Airnub accelerates FedRAMP Moderate",
    date: "May 2024",
    href: "https://airnub.io/blog/fedramp-moderate",
  },
  {
    title: "Platform KPIs that connect trust and delivery",
    date: "April 2024",
    href: "https://airnub.io/blog/platform-kpis",
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Resources"
        title="Enablement, updates, and research for platform and security teams"
        description="Stay current on Airnub platform accelerators, Speckit releases, and operating guidance for high-trust software teams."
      />

      <section>
        <Container>
          <h2 className="text-xl font-semibold text-slate-900">Featured guides</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200"
              >
                <p className="text-sm font-semibold text-sky-600 group-hover:text-sky-500">Guide</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{guide.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <h2 className="text-xl font-semibold text-slate-900">Latest updates</h2>
          <div className="mt-6 space-y-4">
            {updates.map((update) => (
              <Link
                key={update.title}
                href={update.href}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{update.date}</span>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{update.title}</h3>
                <span className="mt-2 text-sm text-sky-600">Read →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Prefer a live walkthrough?</h2>
              <p className="mt-3 text-sm text-slate-600">
                Join a monthly office hour to see how teams automate policy gates, evidence capture, and release governance with Speckit.
              </p>
            </div>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Save my seat
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
