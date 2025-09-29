import Link from "next/link";
import { Container } from "@airnub/ui";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LocaleLink } from "../../../components/LocaleLink";
import { PageHero } from "../../../components/PageHero";
import { assertLocale } from "../../../i18n/routing";

export const revalidate = 604_800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "company.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const company = await getTranslations({ locale, namespace: "company" });

  const hero = company.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
  };
  const values = company.raw("values") as {
    id: string;
    name: string;
    description: string;
  }[];
  const careers = company.raw("careers") as {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  const press = company.raw("press") as {
    cards: {
      id: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      external?: boolean;
    }[];
  };
  const legal = company.raw("legal") as {
    title: string;
    items: {
      id: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
    }[];
  };

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.id}
              className="rounded-3xl border border-border bg-card/60 p-8 shadow-lg shadow-slate-950/40"
            >
              <h2 className="text-xl font-semibold text-foreground">{value.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="careers">
        <Container className="rounded-3xl border border-border bg-card/70 p-10 text-foreground shadow-lg shadow-slate-950/40">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">{careers.title}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{careers.description}</p>
            </div>
            <div>
              <Link
                href={careers.ctaHref}
                className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {careers.ctaLabel}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section id="press">
        <Container className="grid gap-6 md:grid-cols-2">
          {press.cards.map((card) => (
            <div key={card.id} className="rounded-3xl border border-border bg-card/60 p-8 shadow-lg shadow-slate-950/40">
              <h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
              <Link
                href={card.ctaHref}
                className="mt-4 inline-flex text-sm font-semibold text-sky-400"
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noreferrer" : undefined}
              >
                {card.ctaLabel} →
              </Link>
            </div>
          ))}
        </Container>
      </section>

      <section id="legal">
        <Container className="rounded-3xl border border-border bg-card/60 p-10 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-foreground">{legal.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {legal.items.map((item) => (
              <div key={item.id}>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <LocaleLink href={item.ctaHref} className="mt-3 inline-flex text-sm font-semibold text-sky-400">
                  {item.ctaLabel} →
                </LocaleLink>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
