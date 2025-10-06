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
  Section,
  CloudyardLogo,
  ForgeLabsLogo,
  NorthbeamLogo,
} from "@airnub/ui";
import { resolveMicrositeHref } from "@airnub/brand";
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

const workStepIds = ["assessment", "blueprint", "adoption"] as const;

const workCardIds = [
  "operatingModel",
  "regulatedCloud",
  "innerSource",
  "trustReadiness",
] as const;

const projectIds = ["adf", "speckit"] as const;

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
    ctas: [
      {
        id: "primary",
        label: t("hero.primaryCta.label"),
        href: resolveMicrositeHref(t("hero.primaryCta.href")),
        variant: "primary" as const,
      },
      {
        id: "secondary",
        label: t("hero.secondaryCta.label"),
        href: resolveMicrositeHref(t("hero.secondaryCta.href")),
        variant: "secondary" as const,
      },
      {
        id: "tertiary",
        label: t("hero.tertiaryCta.label"),
        href: resolveMicrositeHref(t("hero.tertiaryCta.href")),
        variant: "ghost" as const,
      },
    ],
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

  const projects = {
    title: t("projects.title"),
    description: t("projects.description"),
    visitCta: t("projects.visitCta"),
    docsCta: t("projects.docsCta"),
    items: projectIds.map((id) => ({
      id,
      title: t(`projects.items.${id}.title`),
      description: t(`projects.items.${id}.description`),
      siteHref: resolveMicrositeHref(t(`projects.items.${id}.siteHref`)),
      docsHref: resolveMicrositeHref(t(`projects.items.${id}.docsHref`)),
    })),
  } as const;

  const work = {
    title: t("work.title"),
    description: t("work.description"),
    steps: workStepIds.map((id) => ({
      id,
      label: t(`work.steps.${id}.label`),
      description: t(`work.steps.${id}.description`),
    })),
    cards: workCardIds.map((id) => ({
      id,
      title: t(`work.cards.${id}.title`),
      description: t(`work.cards.${id}.description`),
    })),
  } as const;

  const outcomeAccentStyles = [
    { backgroundColor: "var(--brand-primary)" },
    { backgroundColor: "var(--brand-accent)" },
    { backgroundColor: "color-mix(in srgb, var(--brand-foreground) 70%, transparent)" },
  ] as const;

  const speckitSiteHref = resolveMicrositeHref("https://speckit.airnub.io");
  const speckitPrimaryLink = speckitSiteHref.startsWith("/") ? (
    <LocaleLink href={speckitSiteHref}>{speckit.primaryCta}</LocaleLink>
  ) : (
    <Link href={speckitSiteHref} target="_blank" rel="noreferrer">
      {speckit.primaryCta}
    </Link>
  );

  return (
    <main className="flex flex-col">
      <Hero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={
          <>
            {hero.ctas.map(({ id, href, label, variant }) => {
              const isInternal = href.startsWith("/");
              const link = isInternal ? (
                <LocaleLink href={href}>{label}</LocaleLink>
              ) : (
                <Link href={href} target="_blank" rel="noreferrer">
                  {label}
                </Link>
              );

              return (
                <Button key={id} variant={variant} asChild>
                  {link}
                </Button>
              );
            })}
          </>
        }
      />

      <Section>
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              {projects.title}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              {projects.description}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.items.map((project) => {
              const siteIsInternal = project.siteHref.startsWith("/");
              const docsIsInternal = project.docsHref.startsWith("/");

              const siteLink = siteIsInternal ? (
                <LocaleLink href={project.siteHref}>{projects.visitCta}</LocaleLink>
              ) : (
                <Link href={project.siteHref} target="_blank" rel="noopener">
                  {projects.visitCta}
                </Link>
              );

              const docsLink = docsIsInternal ? (
                <LocaleLink href={project.docsHref}>{projects.docsCta}</LocaleLink>
              ) : (
                <Link href={project.docsHref} target="_blank" rel="noopener">
                  {projects.docsCta}
                </Link>
              );

              return (
                <Card key={project.id} className="flex h-full flex-col">
                  <CardHeader className="flex-1 space-y-3">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-3">
                      <Button asChild>{siteLink}</Button>
                      <Button variant="ghost" asChild>
                        {docsLink}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

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
            <Button asChild>{speckitPrimaryLink}</Button>
            <Button variant="ghost" asChild>
              <LocaleLink href="/projects">{speckit.secondaryCta}</LocaleLink>
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
        title={work.title}
        description={work.description}
        items={work.steps.map((step) => ({
          id: step.id,
          title: step.label,
          description: step.description,
        }))}
        tone="subtle"
        aside={
          <div className="grid gap-6 md:grid-cols-2">
            {work.cards.map((card) => (
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
    </main>
  );
}
