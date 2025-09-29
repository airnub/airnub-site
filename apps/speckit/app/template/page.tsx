import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const template = getSpeckitMessages(language).template;
  return {
    title: template.hero.title,
    description: template.hero.description,
  };
}

export default async function TemplatePage() {
  const language = await getCurrentLanguage();
  const template = getSpeckitMessages(language).template;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={template.hero.eyebrow}
        title={template.hero.title}
        description={template.hero.description}
        actions={
          template.hero.actions.primaryLabel ? (
            <Link
              href={template.hero.actions.primaryHref ?? "https://github.com/airnub/speckit-templates"}
              target={template.hero.actions.primaryHref?.startsWith("http") ? "_blank" : undefined}
              rel={template.hero.actions.primaryHref?.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              {template.hero.actions.primaryLabel}
            </Link>
          ) : null
        }
      />

      <section>
        <Container className="grid gap-6 md:grid-cols-2">
          {template.steps.map((step) => (
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
