import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";

export const revalidate = 604_800;

export const metadata: Metadata = {
  title: "Solutions",
  description: "Choose tailored Speckit playbooks for CISOs and DevSecOps leaders.",
};

const personas = [
  {
    title: "CISO",
    description: "Make compliance continuous. Turn control evidence into a daily signal instead of an annual fire drill.",
    href: "/solutions/ciso",
  },
  {
    title: "DevSecOps",
    description: "Embed guardrails in every pipeline while empowering teams to ship faster with transparency.",
    href: "/solutions/devsecops",
  },
];

export default function SolutionsOverviewPage() {
  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow="Solutions"
        title="Speckit adapts to your security and platform operating model"
        description="Pick a tailored path to orchestrate policy gates, evidence automation, and cross-team collaboration."
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          {personas.map((persona) => (
            <Link
              key={persona.title}
              href={persona.href}
              className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-lg transition hover:border-indigo-500 dark:border-white/10 dark:bg-white/10"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{persona.title}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{persona.description}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700 dark:text-indigo-300 dark:group-hover:text-indigo-200">
                Explore →
              </span>
            </Link>
          ))}
        </Container>
      </section>
    </div>
  );
}
