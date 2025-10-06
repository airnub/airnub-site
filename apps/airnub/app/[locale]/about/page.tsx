import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@airnub/ui";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LocaleLink } from "../../../components/LocaleLink";
import { PageHero } from "../../../components/PageHero";
import { assertLocale } from "../../../i18n/routing";
import { resolvedBrandConfig as airnubBrand } from "@airnub/brand";

export const revalidate = 604_800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "about.metadata" });

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
  const about = await getTranslations({ locale, namespace: "about" });

  const hero = about.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
  };
  const values = about.raw("values") as {
    id: string;
    name: string;
    description: string;
  }[];
  const careers = about.raw("careers") as {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  const press = about.raw("press") as {
    cards: {
      id: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
      external?: boolean;
    }[];
  };
  const legal = about.raw("legal") as {
    title: string;
    items: {
      id: string;
      title: string;
      description: string;
      ctaLabel: string;
      ctaHref: string;
    }[];
  };

  const salesEmail = airnubBrand.contact.sales ?? airnubBrand.contact.support ?? airnubBrand.contact.general;
  const careersEmail = airnubBrand.contact.careers ?? salesEmail;
  const pressEmail = airnubBrand.contact.press ?? salesEmail;

  const careersCta = careersEmail
    ? { label: careersEmail, href: `mailto:${careersEmail}` }
    : { label: careers.ctaLabel, href: careers.ctaHref };

  const pressCards = press.cards.map((card) => {
    if (card.id === "pressKit" && pressEmail) {
      return {
        ...card,
        ctaLabel: pressEmail,
        ctaHref: `mailto:${pressEmail}`,
        external: false,
      };
    }
    return card;
  });

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <Card key={value.id} className="bg-card/60 shadow-lg shadow-slate-950/40">
              <CardHeader>
                <CardTitle className="text-xl">{value.name}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </section>

      <section id="careers">
        <Container>
          <Card className="bg-card/70 text-foreground shadow-lg shadow-slate-950/40">
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-2 lg:items-center">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl tracking-tight">{careers.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {careers.description}
                </CardDescription>
              </CardHeader>
              <div>
                <Link
                  href={careersCta.href}
                  className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {careersCta.label}
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section id="press">
        <Container className="grid gap-6 md:grid-cols-2">
          {pressCards.map((card) => (
            <Card key={card.id} className="bg-card/60 shadow-lg shadow-slate-950/40">
              <CardHeader>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href={card.ctaHref}
                  className="inline-flex text-sm font-semibold text-sky-400"
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noreferrer" : undefined}
                >
                  {card.ctaLabel} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>

      <section id="legal">
        <Container>
          <Card className="bg-card/60 shadow-lg shadow-slate-950/40">
            <CardHeader>
              <CardTitle className="text-2xl">{legal.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 pt-0 md:grid-cols-2">
              {legal.items.map((item) => (
                <div key={item.id} className="space-y-3">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <LocaleLink href={item.ctaHref} className="inline-flex text-sm font-semibold text-sky-400">
                    {item.ctaLabel} →
                  </LocaleLink>
                </div>
              ))}
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
