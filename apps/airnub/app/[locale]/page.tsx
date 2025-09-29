import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@airnub/ui";
import { serverFetch } from "@airnub/seo";
import { getTranslations } from "next-intl/server";
import { PageHero } from "../../components/PageHero";
import { LocaleLink } from "../../components/LocaleLink";
import { assertLocale } from "../../i18n/routing";

export const revalidate = 86_400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "home.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

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
    <div className="space-y-24 pb-24">
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
            <Card key={item.id}>
              <CardHeader className="p-8">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </section>

      <section>
        <Container className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("customers.eyebrow")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {customerItems.map((customer) => (
              <Card key={customer.id} aria-label={customer.name} className="h-16 w-40">
                <CardContent className="flex h-full items-center justify-center p-4">
                  <Image src={customer.logo} alt={customer.name} width={120} height={40} className="object-contain" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <Card>
            <CardContent className="grid gap-12 p-10 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <CardTitle className="text-3xl tracking-tight text-card-foreground sm:text-4xl">
                  {speckit.title}
                </CardTitle>
                <CardDescription className="mt-4 text-base text-muted-foreground">
                  {speckit.description}
                </CardDescription>
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
              <Card>
                <CardHeader className="p-8">
                  <CardTitle className="text-lg">{speckit.outcomesTitle}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-3 text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,3fr] lg:items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">{services.title}</h2>
              <p className="mt-4 text-base text-muted-foreground">{services.description}</p>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {services.steps.map((step) => (
                <li key={step.id}>
                  <strong className="font-semibold text-foreground">{step.label}</strong>{" "}
                  {step.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.cards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
