import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
import { getTranslations } from "next-intl/server";
import { LocaleLink } from "../../../components/LocaleLink";
import { PageHero } from "../../../components/PageHero";
import { assertLocale } from "../../../i18n/routing";

export const revalidate = 86_400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "trust.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const trust = await getTranslations({ locale, namespace: "trust" });

  const hero = trust.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
  };
  const highlights = trust.raw("highlights") as {
    id: string;
    title: string;
    description: string;
    href: string;
  }[];
  const highlightCta = trust("highlightCta");
  const request = trust.raw("request") as {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {highlights.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-3xl border border-border bg-card/60 p-8 text-left shadow-lg shadow-slate-950/40 transition hover:border-ring/40"
              target="_blank"
              rel="noreferrer"
            >
              <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-sky-400">{highlightCta} →</span>
            </Link>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-border bg-card/70 p-10 shadow-lg shadow-slate-950/40">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{request.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{request.description}</p>
            </div>
            <div>
              <LocaleLink
                href={request.ctaHref}
                className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {request.ctaLabel}
              </LocaleLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
