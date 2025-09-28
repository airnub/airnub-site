import { Container } from "@airnub/ui";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "../../../components/PageHero";
import { ContactForm } from "./ContactForm";
import { submitLead } from "./actions";
import type { LeadFormState } from "./actions";
import { assertLocale } from "../../../i18n/routing";

export const revalidate = 86_400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "contact.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

type ContactShortcutsProps = {
  emailTitle: string;
  emailSales: string;
  emailSecurity: string;
  officeTitle: string;
  officeDescription: string;
  officeCta: string;
};

function ContactShortcuts({
  emailTitle,
  emailSales,
  emailSecurity,
  officeTitle,
  officeDescription,
  officeCta,
}: ContactShortcutsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{emailTitle}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {emailSales}: <a className="text-sky-600 underline-offset-4 hover:underline dark:text-sky-400" href="mailto:hello@airnub.io">hello@airnub.io</a>
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {emailSecurity}: <a className="text-sky-600 underline-offset-4 hover:underline dark:text-sky-400" href="mailto:security@airnub.io">security@airnub.io</a>
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{officeTitle}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{officeDescription}</p>
        <a
          href="https://cal.com/airnub/office-hours"
          className="mt-3 inline-flex text-sm font-semibold text-sky-600 underline-offset-4 hover:underline dark:text-sky-400"
          target="_blank"
          rel="noreferrer"
        >
          {officeCta} →
        </a>
      </div>
    </div>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "contact" });
  const toastTranslations = await getTranslations({ locale, namespace: "toast" });

  const initialLeadFormState: LeadFormState = { status: "idle" };

  const formLabels = {
    name: t("form.fields.name"),
    email: t("form.fields.email"),
    company: t("form.fields.company"),
    message: t("form.fields.message"),
    required: t("form.required"),
    submit: t("form.submit"),
    success: {
      title: t("form.success.title"),
      description: t("form.success.description"),
    },
    error: {
      title: t("form.error.title"),
      description: t("form.error.description"),
    },
    validation: {
      email: t("form.validation.email"),
    },
  };

  return (
    <div className="space-y-16 pb-24 text-slate-700 dark:text-slate-300">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-slate-950/40">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t("form.title")}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t("form.description")}</p>
            <ContactForm
              action={submitLead}
              initialState={initialLeadFormState}
              labels={formLabels}
              toastDismissLabel={toastTranslations("dismiss")}
            />
          </div>
          <ContactShortcuts
            emailTitle={t("shortcuts.email.title")}
            emailSales={t("shortcuts.email.sales")}
            emailSecurity={t("shortcuts.email.security")}
            officeTitle={t("shortcuts.officeHours.title")}
            officeDescription={t("shortcuts.officeHours.description")}
            officeCta={t("shortcuts.officeHours.cta")}
          />
        </Container>
      </section>
    </div>
  );
}
