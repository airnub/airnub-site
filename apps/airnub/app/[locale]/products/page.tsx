import Link from "next/link";
import type { Metadata } from "next";
import { Button, Container } from "@airnub/ui";
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
              <article
                key={offering.id}
                className="flex h-full flex-col justify-between rounded-3xl border border-border bg-card/60 p-8 shadow-lg shadow-slate-950/40"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-foreground">{offering.name}</h2>
                    {offering.badge ? (
                      <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
                        {offering.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{offering.description}</p>
                </div>
                <div className="mt-8">
                  <LinkComponent
                    href={offering.href}
                    className="text-sm font-semibold text-sky-400 transition hover:text-sky-300"
                    {...linkProps}
                  >
                    {offeringCta} →
                  </LinkComponent>
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 lg:grid-cols-2">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-3xl border border-border bg-card/70 p-8 shadow-lg shadow-slate-950/40">
              <h3 className="text-xl font-semibold text-foreground">{insight.title}</h3>
              {insight.description ? (
                <p className="mt-3 text-sm text-muted-foreground">{insight.description}</p>
              ) : null}
              {insight.bullets ? (
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {insight.bullets.map((bullet) => (
                    <li key={bullet}>→ {bullet}</li>
                  ))}
                </ul>
              ) : null}
              {insight.paragraphs ? (
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {insight.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </Container>
      </section>

      <JsonLd data={jsonLd} />
    </div>
  );
}
