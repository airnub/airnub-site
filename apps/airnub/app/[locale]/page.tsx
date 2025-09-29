import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CTASection,
  FeatureGrid,
  Hero,
  LogoCloud,
  CloudyardLogo,
  ForgeLabsLogo,
  NorthbeamLogo,
} from "@airnub/ui";
import { serverFetch } from "@airnub/seo";
import { getTranslations } from "next-intl/server";
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

const customerIds = ["forgeLabs", "cloudyard", "northbeam"] as const;

type CustomerId = (typeof customerIds)[number];

const customerLogos: Record<CustomerId, typeof CloudyardLogo> = {
  forgeLabs: ForgeLabsLogo,
  cloudyard: CloudyardLogo,
  northbeam: NorthbeamLogo,
};

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
  customers: customerIds,
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

  const customerItems = customers.map((customerId) => ({
    id: customerId,
    name: t(`customers.items.${customerId}`),
    Logo: customerLogos[customerId],
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

  const outcomeAccentStyles = [
    { backgroundColor: "var(--brand-primary)" },
    { backgroundColor: "var(--brand-accent)" },
    { backgroundColor: "color-mix(in srgb, var(--brand-foreground) 70%, transparent)" },
  ] as const;

  return (
    <div className="space-y-24 pb-24">
      <Hero
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

      <FeatureGrid
        items={highlightItems.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
        }))}
      />

      <LogoCloud
        eyebrow={t("customers.eyebrow")}
        items={customerItems.map(({ id, name, Logo }) => ({
          id,
          name,
          logo: <Logo className="h-6 w-auto" aria-hidden="true" focusable="false" />,
        }))}
      />

      <CTASection
        title={speckit.title}
        description={speckit.description}
        actions={
          <>
            <Button asChild>
              <Link href="https://speckit.airnub.io" target="_blank" rel="noreferrer">
                {speckit.primaryCta}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <LocaleLink href="/products">{speckit.secondaryCta}</LocaleLink>
            </Button>
          </>
        }
        aside={
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{speckit.outcomesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {speckit.outcomes.map((outcome, index) => (
                  <li key={outcome.id} className="flex gap-3">
                    <span
                      className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full"
                      style={outcomeAccentStyles[index % outcomeAccentStyles.length]}
                      aria-hidden="true"
                    />
                    <span>{outcome.copy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        }
      />

      <CTASection
        title={services.title}
        description={services.description}
        items={services.steps.map((step) => ({
          id: step.id,
          title: step.label,
          description: step.description,
        }))}
        tone="subtle"
        aside={
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
        }
      />
    </div>
  );
}
