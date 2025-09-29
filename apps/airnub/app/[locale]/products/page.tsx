import Link from "next/link";
import type { Metadata } from "next";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { getTranslations } from "next-intl/server";
import { PageHero } from "../../../components/PageHero";
import { JsonLd } from "../../../components/JsonLd";
import { buildAirnubProductPortfolioJsonLd } from "../../../lib/jsonld";
import { LocaleLink } from "../../../components/LocaleLink";
import { assertLocale } from "../../../i18n/routing";

export const revalidate = 86_400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "products.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

const jsonLd = buildAirnubProductPortfolioJsonLd();

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const products = await getTranslations({ locale, namespace: "products" });

  const hero = products.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
  };
  const offerings = products.raw("offerings") as {
    id: string;
    name: string;
    description: string;
    href: string;
    badge?: string;
    external?: boolean;
  }[];
  const offeringCta = products("offeringsCta");
  const insights = products.raw("insights") as {
    id: string;
    title: string;
    description?: string;
    bullets?: string[];
    paragraphs?: string[];
  }[];

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        actions={
          <Button asChild>
            <LocaleLink href={hero.primaryCta.href}>{hero.primaryCta.label}</LocaleLink>
          </Button>
        }
      />

      <section>
        <Container className="grid gap-8 md:grid-cols-2">
          {offerings.map((offering) => {
            const isExternal = offering.external ?? offering.href.startsWith("http");
            const LinkComponent = isExternal ? Link : LocaleLink;
            const linkProps = isExternal
              ? ({ target: "_blank", rel: "noreferrer" } as const)
              : {};

            return (
              <Card
                key={offering.id}
                className="flex h-full flex-col justify-between bg-card/60 shadow-lg shadow-slate-950/40"
              >
                <CardHeader className="gap-4">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{offering.name}</CardTitle>
                    {offering.badge ? (
                      <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
                        {offering.badge}
                      </span>
                    ) : null}
                  </div>
                  <CardDescription>{offering.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <LinkComponent
                    href={offering.href}
                    className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
                    {...linkProps}
                  >
                    {offeringCta} →
                  </LinkComponent>
                </CardContent>
              </Card>
            );
          })}
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          {insights.map((insight) => (
            <Card key={insight.id} className="bg-card/70 shadow-lg shadow-slate-950/40">
              <CardHeader className="gap-3">
                <CardTitle className="text-xl">{insight.title}</CardTitle>
                {insight.description ? <CardDescription>{insight.description}</CardDescription> : null}
              </CardHeader>
              {(insight.bullets || insight.paragraphs) && (
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {insight.bullets ? (
                    <ul className="space-y-2">
                      {insight.bullets.map((bullet) => (
                        <li key={bullet}>→ {bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {insight.paragraphs
                    ? insight.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                    : null}
                </CardContent>
              )}
            </Card>
          ))}
        </Container>
      </section>

      <JsonLd data={jsonLd} />
    </div>
  );
}
