import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@airnub/ui";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "solutions.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const solutions = await getTranslations({ locale, namespace: "solutions" });

  const hero = solutions.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
  };
  const sectors = solutions.raw("sectors") as {
    id: string;
    name: string;
    summary: string;
    bullets: string[];
  }[];
  const partner = solutions.raw("partner") as {
    title: string;
    description: string;
    expectationsTitle: string;
    expectations: string[];
  };

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {sectors.map((sector) => (
            <Card key={sector.id} className="bg-card/60 shadow-lg shadow-slate-950/40">
              <CardHeader>
                <CardTitle className="text-xl">{sector.name}</CardTitle>
                <CardDescription>{sector.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  {sector.bullets.map((bullet) => (
                    <li key={bullet}>→ {bullet}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>

      <section>
        <Container>
          <Card className="bg-gradient-to-br from-muted via-background to-muted text-foreground shadow-xl shadow-slate-950/40">
            <CardContent className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl tracking-tight">{partner.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {partner.description}
                </CardDescription>
              </CardHeader>
              <div className="rounded-2xl border border-border/10 bg-card/5 p-6 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">{partner.expectationsTitle}</p>
                <ul className="mt-3 space-y-2">
                  {partner.expectations.map((item) => (
                    <li key={item}>→ {item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
