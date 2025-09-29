import type { Metadata } from "next";
import { Button, Container } from "@airnub/ui";
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
  const t = await getTranslations({ locale, namespace: "services.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const services = await getTranslations({ locale, namespace: "services" });

  const hero = services.raw("hero") as {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
  };
  const engagements = services.raw("engagements") as {
    id: string;
    title: string;
    description: string;
    deliverables: string[];
  }[];
  const deliverablesLabel = services("deliverablesLabel");
  const outcomes = services.raw("outcomes") as {
    title: string;
    description: string;
    note: string;
  };

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
            <article
              key={engagement.id}
              id={engagement.id}
              className="rounded-3xl border border-border bg-card/60 p-10 shadow-lg shadow-slate-950/40"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:max-w-2xl">
                  <h2 className="text-2xl font-semibold text-foreground">{engagement.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{engagement.description}</p>
                </div>
                <div className="lg:min-w-[16rem]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{deliverablesLabel}</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {engagement.deliverables.map((item) => (
                      <li key={item}>→ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-border bg-card/80 p-10 text-foreground shadow-xl shadow-slate-950/40">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">{outcomes.title}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{outcomes.description}</p>
            </div>
            <div className="rounded-2xl border border-border/10 bg-card/5 p-6 text-sm text-foreground">
              <p>{outcomes.note}</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
