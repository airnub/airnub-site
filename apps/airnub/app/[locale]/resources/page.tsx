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

export const revalidate = 21_600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "resources.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const resources = await getTranslations({ locale, namespace: "resources" });

  const hero = resources.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
  };
  const guides = resources.raw("guides") as {
    id: string;
    title: string;
    description: string;
    href: string;
  }[];
  const guideLabel = resources("guideLabel");
  const updates = resources.raw("updates") as {
    id: string;
    title: string;
    date: string;
    href: string;
  }[];
  const updateCta = resources("updateCta");
  const officeHours = resources.raw("officeHours") as {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container>
          <h2 className="text-xl font-semibold text-foreground">{resources("guidesHeading")}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.id} href={guide.href} className="group block">
                <Card className="bg-card/60 transition hover:-translate-y-1 hover:border-ring/40 hover:shadow-xl shadow-lg shadow-slate-950/40">
                  <CardHeader className="gap-3">
                    <p className="text-sm font-semibold text-sky-400 transition group-hover:text-sky-300">
                      {guideLabel}
                    </p>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <h2 className="text-xl font-semibold text-foreground">{resources("updatesHeading")}</h2>
          <div className="mt-6 space-y-4">
            {updates.map((update) => (
              <Link key={update.id} href={update.href} className="block">
                <Card className="bg-card/60 transition hover:border-ring/40 hover:shadow-xl shadow-lg shadow-slate-950/40">
                  <CardHeader className="gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {update.date}
                    </span>
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="text-sm font-semibold text-sky-400">{updateCta} →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
    </div>
  );
}
