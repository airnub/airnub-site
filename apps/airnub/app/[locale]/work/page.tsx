import type { Metadata } from "next";
import {
  Button,
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
  const t = await getTranslations({ locale, namespace: "work.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const work = await getTranslations({ locale, namespace: "work" });

  const hero = work.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
  };
  const engagements = work.raw("engagements") as {
    id: string;
    title: string;
    description: string;
    deliverables: string[];
  }[];
  const deliverablesLabel = work("deliverablesLabel");
  const outcomes = work.raw("outcomes") as {
    title: string;
    description: string;
    note: string;
  };
  const solutions = work.raw("solutions") as {
    hero: { title: string; description: string };
    sectors: {
      id: string;
      name: string;
      summary: string;
      bullets: string[];
    }[];
    partner: {
      title: string;
      description: string;
      expectationsTitle: string;
      expectations: string[];
    };
  };

  const solutionsIntro = solutions.hero;
  const sectors = solutions.sectors;
  const partner = solutions.partner;

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
        <Container className="space-y-10">
          {engagements.map((engagement) => (
            <Card
              key={engagement.id}
              id={engagement.id}
              className="bg-card/60 shadow-lg shadow-slate-950/40"
            >
              <CardContent className="flex flex-col gap-6 pt-5 lg:flex-row lg:items-start lg:justify-between">
                <CardHeader className="p-0 lg:max-w-2xl">
                  <CardTitle className="text-2xl">{engagement.title}</CardTitle>
                  <CardDescription>{engagement.description}</CardDescription>
                </CardHeader>
                <div className="space-y-3 text-sm text-muted-foreground lg:min-w-[16rem]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {deliverablesLabel}
                  </p>
                  <ul className="space-y-2">
                    {engagement.deliverables.map((item) => (
                      <li key={item}>→ {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>

      <section>
        <Container className="space-y-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {solutionsIntro.title}
            </h2>
            <p className="mt-4 text-base text-muted-foreground">{solutionsIntro.description}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
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
          </div>
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

      <section>
        <Container>
          <Card className="bg-card/80 text-foreground shadow-xl shadow-slate-950/40">
            <CardContent className="grid gap-8 pt-5 lg:grid-cols-2 lg:items-center">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl tracking-tight">{outcomes.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {outcomes.description}
                </CardDescription>
              </CardHeader>
              <div className="rounded-2xl border border-border/10 bg-card/5 p-6 text-sm text-foreground">
                <p>{outcomes.note}</p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
