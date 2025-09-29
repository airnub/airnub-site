import { Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "../../../components/PageHero";
import { ContactForm } from "./ContactForm";
import { submitLead } from "./actions";
import type { LeadFormState } from "./actions";
import { assertLocale } from "../../../i18n/routing";
import { resolvedBrandConfig as airnubBrand } from "@airnub/brand";

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
  salesEmail?: string;
  securityEmail?: string;
  officeTitle: string;
  officeDescription: string;
  officeCta: string;
};

function ContactShortcuts({
  emailTitle,
  emailSales,
  emailSecurity,
  salesEmail,
  securityEmail,
  officeTitle,
  officeDescription,
  officeCta,
}: ContactShortcutsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-card/80 shadow-lg shadow-slate-900/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {emailTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {salesEmail ? (
            <p>
              {emailSales}:{" "}
              <a
                className="text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                href={`mailto:${salesEmail}`}
              >
                {salesEmail}
              </a>
            </p>
          ) : null}
          {securityEmail ? (
            <p>
              {emailSecurity}:{" "}
              <a
                className="text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                href={`mailto:${securityEmail}`}
              >
                {securityEmail}
              </a>
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Card className="bg-card/80 shadow-lg shadow-slate-900/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {officeTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{officeDescription}</p>
          <a
            href="https://cal.com/airnub/office-hours"
            className="inline-flex text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {officeCta} →
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "contact" });
  const toastTranslations = await getTranslations({ locale, namespace: "toast" });

  const initialLeadFormState: LeadFormState = { status: "idle" };

  const salesEmail =
    airnubBrand.contact.sales ?? airnubBrand.contact.support ?? airnubBrand.contact.general;
  const securityEmail = airnubBrand.contact.security ?? airnubBrand.contact.general;

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
      description: salesEmail
        ? t("form.error.description", { email: salesEmail })
        : t("form.error.description"),
    },
    validation: {
      email: t("form.validation.email"),
    },
  };

  return (
    <div className="space-y-16 pb-24 text-muted-foreground">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <Card className="bg-card/80 shadow-lg shadow-slate-900/5 backdrop-blur">
            <CardHeader className="gap-4">
              <CardTitle className="text-xl text-foreground">{t("form.title")}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t("form.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                action={submitLead}
                initialState={initialLeadFormState}
                labels={formLabels}
                toastDismissLabel={toastTranslations("dismiss")}
              />
            </CardContent>
          </Card>
          <ContactShortcuts
            emailTitle={t("shortcuts.email.title")}
            emailSales={t("shortcuts.email.sales")}
            emailSecurity={t("shortcuts.email.security")}
            salesEmail={salesEmail}
            securityEmail={securityEmail}
            officeTitle={t("shortcuts.officeHours.title")}
            officeDescription={t("shortcuts.officeHours.description")}
            officeCta={t("shortcuts.officeHours.cta")}
          />
        </Container>
      </section>
    </div>
  );
}
