import type { Metadata } from "next";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages, type SpeckitMessages } from "../../i18n/messages";
import { submitLead, type LeadFormState } from "./actions";
import speckitBrand from "../../brand.config";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const contact = getSpeckitMessages(language).contact;
  return {
    title: contact.hero.title,
    description: contact.hero.description,
  };
}

type ContactShortcutsProps = {
  shortcuts: SpeckitMessages["contact"]["shortcuts"];
  productEmail?: string;
  securityEmail?: string;
};

function formatTemplate(template: string, values: Record<string, string | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = values[key];
    return value ?? match;
  });
}

function ContactShortcuts({ shortcuts, productEmail, securityEmail }: ContactShortcutsProps) {
  const productQuestions = productEmail
    ? formatTemplate(shortcuts.productQuestions, {
        productEmail,
        email: productEmail,
      })
    : shortcuts.productQuestions;
  const securityLine = securityEmail
    ? formatTemplate(shortcuts.security, {
        securityEmail,
        email: securityEmail,
      })
    : shortcuts.security;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {shortcuts.emailHeading}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{productQuestions}</p>
          <p>{securityLine}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {shortcuts.docsHeading}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{shortcuts.docsDescription}</p>
          <Button
            asChild
            variant="ghost"
            className="px-0 text-primary transition-colors hover:text-primary/80"
          >
            <a href="https://docs.speckit.dev" target="_blank" rel="noreferrer">
              {shortcuts.docsCtaLabel}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ContactPage() {
  const language = await getCurrentLanguage();
  const contact = getSpeckitMessages(language).contact;
  const productEmail =
    speckitBrand.contact.product ??
    speckitBrand.contact.general ??
    speckitBrand.contact.support;
  const securityEmail = speckitBrand.contact.security ?? speckitBrand.contact.general;
  const initialLeadFormState: LeadFormState = { status: "idle" };

  const errorEmail = productEmail ?? securityEmail ?? undefined;
  const formattedErrorDescription = errorEmail
    ? formatTemplate(contact.form.error.description, { email: errorEmail })
    : contact.form.error.description;

  const formLabels = {
    name: contact.form.fields.nameLabel,
    email: contact.form.fields.emailLabel,
    company: contact.form.fields.companyLabel,
    focus: contact.form.fields.focusLabel,
    emailRequiredSuffix: contact.form.fields.emailRequiredSuffix,
    required: contact.form.requiredLabel,
    submit: contact.form.submitLabel,
    success: contact.form.success,
    error: {
      title: contact.form.error.title,
      description: formattedErrorDescription,
    },
    validation: contact.form.validation,
  };

  const toastDismissLabel = contact.form.toastDismissLabel;

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        description={contact.hero.description}
      />

      <section>
        <Container className="grid gap-12 lg:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader className="gap-4">
              <CardTitle className="text-xl text-foreground">{contact.form.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{contact.form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                action={submitLead}
                initialState={initialLeadFormState}
                labels={formLabels}
                toastDismissLabel={toastDismissLabel}
              />
            </CardContent>
          </Card>
          <ContactShortcuts
            shortcuts={contact.shortcuts}
            productEmail={productEmail}
            securityEmail={securityEmail}
          />
        </Container>
      </section>
    </div>
  );
}
