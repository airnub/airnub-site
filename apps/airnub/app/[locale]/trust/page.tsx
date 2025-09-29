import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@airnub/ui";
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
            <Link key={item.id} href={item.href} className="block" target="_blank" rel="noreferrer">
              <Card className="bg-card/60 text-left transition hover:border-ring/40 hover:shadow-xl shadow-lg shadow-slate-950/40">
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="inline-flex text-sm font-semibold text-sky-400">{highlightCta} →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-card/70 shadow-lg shadow-slate-950/40">
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-2 lg:items-center">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">{request.title}</CardTitle>
                <CardDescription>{request.description}</CardDescription>
              </CardHeader>
              <div>
                <LocaleLink
                  href={request.ctaHref}
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {request.ctaLabel}
                </LocaleLink>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
