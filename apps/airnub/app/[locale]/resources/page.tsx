import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@airnub/ui";
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
    <div className="space-y-16 pb-24 text-slate-300">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />

      <section>
        <Container>
          <h2 className="text-xl font-semibold text-white">{resources("guidesHeading")}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={guide.href}
                className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-sky-500/40"
              >
                <p className="text-sm font-semibold text-sky-400 group-hover:text-sky-300">{guideLabel}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{guide.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{guide.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <h2 className="text-xl font-semibold text-white">{resources("updatesHeading")}</h2>
          <div className="mt-6 space-y-4">
            {updates.map((update) => (
              <Link
                key={update.id}
                href={update.href}
                className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40 transition hover:border-sky-500/40"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{update.date}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{update.title}</h3>
                <span className="mt-2 text-sm font-semibold text-sky-400">{updateCta} →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-lg shadow-slate-950/40">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">{officeHours.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{officeHours.description}</p>
            </div>
            <div>
              <LocaleLink
                href={officeHours.ctaHref}
                className="inline-flex items-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                {officeHours.ctaLabel}
              </LocaleLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
