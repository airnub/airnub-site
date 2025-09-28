import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button, Container } from "@airnub/ui";
import { serverFetch } from "@airnub/seo";
import { getTranslations } from "next-intl/server";
import { PageHero } from "../../components/PageHero";
import { LocaleLink } from "../../components/LocaleLink";
import { assertLocale } from "../../i18n/routing";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Airnub builds governed, enterprise-ready developer platforms",
};

const highlightIds = [
  "unifiedGovernance",
  "evidenceOnDemand",
  "platformAccelerators",
] as const;

const customerLogos = [
  { id: "forgeLabs", logo: "/logos/forge.svg" },
  { id: "cloudyard", logo: "/logos/cloudyard.svg" },
  { id: "northbeam", logo: "/logos/northbeam.svg" },
] as const;

const speckitOutcomeIds = [
  "governedSpecLoop",
  "policyGates",
  "automatedEvidence",
] as const;

const serviceStepIds = ["assessment", "blueprint", "adoption"] as const;

const serviceCardIds = [
  "operatingModel",
  "regulatedCloud",
  "innerSource",
  "trustReadiness",
] as const;

const airnubHomeContent = {
  highlights: highlightIds,
  customers: customerLogos,
} as const;

const airnubHomeContentUrl = `data:application/json,${encodeURIComponent(JSON.stringify(airnubHomeContent))}`;

type AirnubHomeContent = typeof airnubHomeContent;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "home" });

  const { highlights: highlightKeys, customers } = await serverFetch<AirnubHomeContent>(
    airnubHomeContentUrl,
    {
      revalidate,
    }
  );

  const hero = {
    eyebrow: t("hero.eyebrow"),
    title: t("hero.title"),
    description: t("hero.description"),
    primaryCta: t("hero.primaryCta"),
    secondaryCta: t("hero.secondaryCta"),
  } as const;

  const highlightItems = highlightKeys.map((key) => ({
    id: key,
    title: t(`highlights.${key}.title`),
    description: t(`highlights.${key}.description`),
  }));

  const customerItems = customers.map((customer) => ({
    ...customer,
    name: t(`customers.items.${customer.id}`),
  }));

  const speckit = {
    title: t("speckit.title"),
    description: t("speckit.description"),
    primaryCta: t("speckit.primaryCta"),
    secondaryCta: t("speckit.secondaryCta"),
    outcomesTitle: t("speckit.outcomes.title"),
    outcomes: speckitOutcomeIds.map((id) => ({ id, copy: t(`speckit.outcomes.items.${id}`) })),
  } as const;

  const services = {
    title: t("services.title"),
    description: t("services.description"),
    steps: serviceStepIds.map((id) => ({
      id,
      label: t(`services.steps.${id}.label`),
      description: t(`services.steps.${id}.description`),
    })),
    cards: serviceCardIds.map((id) => ({
      id,
      title: t(`services.cards.${id}.title`),
      description: t(`services.cards.${id}.description`),
    })),
  } as const;

  const outcomeAccentClasses = ["bg-sky-400", "bg-violet-400", "bg-emerald-400"] as const;

  return (
    <div className="space-y-24 pb-24 text-slate-700 dark:text-slate-300">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={
          <>
            <Button asChild>
              <LocaleLink href="/contact">{hero.primaryCta}</LocaleLink>
            </Button>
            <Button variant="ghost" asChild>
              <LocaleLink href="/products">{hero.secondaryCta}</LocaleLink>
            </Button>
          </>
        }
      />

      <section>
        <Container className="grid gap-10 lg:grid-cols-3">
          {highlightItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("customers.eyebrow")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {customerItems.map((customer) => (
              <div
                key={customer.id}
                className="flex h-16 w-40 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-inner shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-slate-950/40"
              >
                <Image src={customer.logo} alt={customer.name} width={120} height={40} className="object-contain" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 rounded-3xl border border-slate-200 bg-white/80 p-12 shadow-xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/40 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{speckit.title}</h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{speckit.description}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="https://speckit.airnub.io" target="_blank" rel="noreferrer">
                  {speckit.primaryCta}
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <LocaleLink href="/products">{speckit.secondaryCta}</LocaleLink>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{speckit.outcomesTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
              {speckit.outcomes.map((outcome, index) => {
                const accentClass = outcomeAccentClasses[
                  Math.min(index, outcomeAccentClasses.length - 1)
                ];
                return (
                  <li key={outcome.id} className="flex gap-3">
                    <span
                      className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${accentClass}`}
                      aria-hidden="true"
                    />
                    {outcome.copy}
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{services.title}</h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300">{services.description}</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              {services.steps.map((step) => (
                <li key={step.id}>
                  <strong className="font-semibold text-slate-900 dark:text-white">{step.label}</strong>{" "}
                  {step.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.cards.map((card) => (
              <div
                key={card.id}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
