import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const solutions = getSpeckitMessages(language).solutions;
  return {
    title: solutions.hero.title,
    description: solutions.hero.description,
  };
}

export default async function SolutionsOverviewPage() {
  const language = await getCurrentLanguage();
  const solutions = getSpeckitMessages(language).solutions;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={solutions.hero.eyebrow}
        title={solutions.hero.title}
        description={solutions.hero.description}
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          {solutions.personas.map((persona) => (
            <Link
              key={persona.title}
              href={persona.href}
              className="group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-lg transition hover:border-indigo-500 dark:border-white/10 dark:bg-white/10"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{persona.title}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{persona.description}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700 dark:text-indigo-300 dark:group-hover:text-indigo-200">
                {persona.ctaLabel}
              </span>
            </Link>
          ))}
        </Container>
      </section>
    </div>
  );
}
