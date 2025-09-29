import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages } from "../../i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const product = getSpeckitMessages(language).product;
  return {
    title: product.hero.title,
    description: product.hero.description,
  };
}

export default async function ProductPage() {
  const language = await getCurrentLanguage();
  const product = getSpeckitMessages(language).product;

  return (
    <div className="space-y-20 pb-20">
      <PageHero
        eyebrow={product.hero.eyebrow}
        title={product.hero.title}
        description={product.hero.description}
        actions={
          product.hero.actions.primaryLabel ? (
            <Button asChild>
              <Link href={product.hero.actions.primaryHref ?? "/pricing"}>{product.hero.actions.primaryLabel}</Link>
            </Button>
          ) : null
        }
      />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {product.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/10"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{pillar.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{product.timeline.title}</h2>
            <ol className="mt-6 space-y-6 text-sm text-slate-600 dark:text-slate-300">
              {product.timeline.steps.map((step, index) => (
                <li key={step.name}>
                  <div className="font-semibold text-slate-900 dark:text-white">{`${index + 1}. ${step.name}`}</div>
                  <p className="mt-1">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{product.integrationsCard.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{product.integrationsCard.description}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-700 dark:text-slate-200">
                {product.integrationsCard.items.map((integration) => (
                  <span
                    key={integration}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/5"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{product.supabaseCard.title}</h3>
              {product.supabaseCard.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
