import type { Metadata } from "next";
import { Container } from "@airnub/ui";
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
    <div className="space-y-16 pb-24 text-slate-300">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container className="grid gap-8 lg:grid-cols-3">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-slate-950/40"
            >
              <h2 className="text-xl font-semibold text-white">{sector.name}</h2>
              <p className="mt-3 text-sm text-slate-300">{sector.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {sector.bullets.map((bullet) => (
                  <li key={bullet}>→ {bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-10 text-slate-100 shadow-xl shadow-slate-950/40">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">{partner.title}</h2>
              <p className="mt-4 text-sm text-slate-300">{partner.description}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              <p className="font-semibold text-white">{partner.expectationsTitle}</p>
              <ul className="mt-3 space-y-2">
                {partner.expectations.map((item) => (
                  <li key={item}>→ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
