import type { Metadata } from "next";
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
import { resolveMicrositeHref } from "@airnub/brand";
import { getTranslations } from "next-intl/server";
import { LocaleLink } from "../../../components/LocaleLink";
import { PageHero } from "../../../components/PageHero";
import { assertLocale } from "../../../i18n/routing";

export const revalidate = 86_400;

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/speckit/";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "projects.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const projects = await getTranslations({ locale, namespace: "projects" });

  const hero = projects.raw("hero") as {
    eyebrow?: string;
    title: string;
    description: string;
  };
  const catalog = projects.raw("catalog") as {
    title: string;
    description: string;
    visitCta: string;
    docsCta: string;
    items: Record<
      string,
      {
        title: string;
        description: string;
        siteHref: string;
        docsHref: string;
      }
    >;
  };
  const speckitRaw = projects.raw("speckit") as {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    outcomes?: { title: string; items: Record<string, string> };
  };
  const speckit = {
    title: speckitRaw.title,
    description: speckitRaw.description,
    primaryCta: speckitRaw.primaryCta,
    secondaryCta: speckitRaw.secondaryCta,
    outcomesTitle: speckitRaw.outcomes?.title ?? "",
    outcomes: speckitRaw.outcomes
      ? Object.entries(speckitRaw.outcomes.items ?? {}).map(([id, copy]) => ({ id, copy }))
      : [],
  } as const;
  const guides = projects.raw("guides") as {
    heading: string;
    label: string;
    items: { id: string; title: string; description: string; href: string }[];
  };
  const updates = projects.raw("updates") as {
    heading: string;
    cta: string;
    items: { id: string; title: string; date: string; href: string }[];
  };
  const officeHours = projects.raw("officeHours") as {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  const trust = projects.raw("trust") as {
    hero: { eyebrow?: string; title: string; description: string };
    highlightCta: string;
    highlights: { id: string; title: string; description: string; href: string }[];
    request: { title: string; description: string; ctaLabel: string; ctaHref: string };
  };

  const catalogItems = Object.entries(catalog.items).map(([id, item]) => {
    const siteHref = resolveMicrositeHref(item.siteHref);
    const docsHref = resolveMicrositeHref(
      id === "speckit" ? DOCS_URL : item.docsHref,
    );

    return {
      id,
      title: item.title,
      description: item.description,
      siteHref,
      docsHref,
    };
  });

  const heroCtaHref = DOCS_URL;
  const heroCtaLabel = catalog.docsCta;

  const speckitSiteHref = resolveMicrositeHref("https://speckit.airnub.io");
  const speckitDocsHref = resolveMicrositeHref(DOCS_URL);
  const speckitPrimaryLink = speckitSiteHref.startsWith("/") ? (
    <LocaleLink href={speckitSiteHref}>{speckit.primaryCta}</LocaleLink>
  ) : (
    <Link href={speckitSiteHref} target="_blank" rel="noreferrer">
      {speckit.primaryCta}
    </Link>
  );
  const docsButtonLabel = catalog.docsCta;
  const speckitDocsLink = speckitDocsHref.startsWith("/") ? (
    <LocaleLink href={speckitDocsHref}>{docsButtonLabel}</LocaleLink>
  ) : (
    <Link href={speckitDocsHref} target="_blank" rel="noreferrer">
      {docsButtonLabel}
    </Link>
  );

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={
          heroCtaLabel ? (
            <Button asChild>
              <Link href={heroCtaHref} target="_blank" rel="noreferrer">
                {heroCtaLabel}
              </Link>
            </Button>
          ) : undefined
        }
      />

      <section>
        <Container className="space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {catalog.title}
            </h2>
            <p className="mt-4 text-base text-muted-foreground">{catalog.description}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {catalogItems.map((project) => {
              const siteIsInternal = project.siteHref.startsWith("/");
              const docsIsInternal = project.docsHref.startsWith("/");

              const siteLink = siteIsInternal ? (
                <LocaleLink href={project.siteHref}>{catalog.visitCta}</LocaleLink>
              ) : (
                <Link href={project.siteHref} target="_blank" rel="noreferrer">
                  {catalog.visitCta}
                </Link>
              );

              const docsLink = docsIsInternal ? (
                <LocaleLink href={project.docsHref}>{catalog.docsCta}</LocaleLink>
              ) : (
                <Link href={project.docsHref} target="_blank" rel="noreferrer">
                  {catalog.docsCta}
                </Link>
              );

              return (
                <Card key={project.id} className="bg-card/60 shadow-lg shadow-slate-950/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-4 pt-0 text-sm font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1">{siteLink} →</span>
                    <span className="inline-flex items-center gap-1">{docsLink} →</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-card/70 shadow-lg shadow-slate-950/40">
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl tracking-tight">{speckit.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {speckit.description}
                </CardDescription>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-foreground">
                  <Button asChild>{speckitPrimaryLink}</Button>
                  <Button asChild variant="ghost">
                    {speckitDocsLink}
                  </Button>
                </div>
              </CardHeader>
              <Card className="bg-card/80">
                <CardHeader>
                  <CardTitle className="text-lg">{speckit.outcomesTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {speckit.outcomes.map((outcome) => (
                      <li key={outcome.id}>→ {outcome.copy}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{guides.heading}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {guides.items.map((guide) => (
                <Link key={guide.id} href={guide.href} className="group block">
                  <Card className="bg-card/60 transition hover:-translate-y-1 hover:border-ring/40 hover:shadow-xl shadow-lg shadow-slate-950/40">
                    <CardHeader className="gap-3">
                      <p className="text-sm font-semibold text-sky-400 transition group-hover:text-sky-300">
                        {guides.label}
                      </p>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{updates.heading}</h2>
            <div className="mt-6 space-y-4">
              {updates.items.map((update) => (
                <Link key={update.id} href={update.href} className="block">
                  <Card className="bg-card/60 transition hover:border-ring/40 hover:shadow-xl shadow-lg shadow-slate-950/40">
                    <CardHeader className="gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {update.date}
                      </span>
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <span className="text-sm font-semibold text-sky-400">{updates.cta} →</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-card/70 shadow-lg shadow-slate-950/40">
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-2 lg:items-center">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">{officeHours.title}</CardTitle>
                <CardDescription>{officeHours.description}</CardDescription>
              </CardHeader>
              <div>
                <LocaleLink
                  href={officeHours.ctaHref}
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {officeHours.ctaLabel}
                </LocaleLink>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {trust.hero.title}
            </h2>
            <p className="mt-4 text-base text-muted-foreground">{trust.hero.description}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {trust.highlights.map((item) => (
              <Link key={item.id} href={item.href} target="_blank" rel="noreferrer" className="block">
                <Card className="bg-card/60 text-left transition hover:border-ring/40 hover:shadow-xl shadow-lg shadow-slate-950/40">
                  <CardHeader>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex text-sm font-semibold text-sky-400">{trust.highlightCta} →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <Card className="bg-card/70 shadow-lg shadow-slate-950/40">
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-2 lg:items-center">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">{trust.request.title}</CardTitle>
                <CardDescription>{trust.request.description}</CardDescription>
              </CardHeader>
              <div>
                <LocaleLink
                  href={trust.request.ctaHref}
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {trust.request.ctaLabel}
                </LocaleLink>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
