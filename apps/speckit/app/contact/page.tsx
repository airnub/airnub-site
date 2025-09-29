import type { Metadata } from "next";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from "@airnub/ui";
import { PageHero } from "../../components/PageHero";
import { getCurrentLanguage } from "../../lib/language";
import { getSpeckitMessages, type SpeckitMessages } from "../../i18n/messages";
import { submitLead } from "./actions";

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
};

function ContactShortcuts({ shortcuts }: ContactShortcutsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-6">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {shortcuts.emailHeading}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-6 pt-0 text-sm text-muted-foreground">
          <p>{shortcuts.productQuestions}</p>
          <p>{shortcuts.security}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-6">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {shortcuts.docsHeading}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-6 pt-0 text-sm text-muted-foreground">
          <p>{shortcuts.docsDescription}</p>
          <Button
            asChild
            variant="ghost"
            className="px-0 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
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
            <CardHeader className="p-10">
              <CardTitle className="text-xl text-foreground">{contact.form.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{contact.form.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <form action={submitLead} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-foreground">
                      {contact.form.fields.nameLabel}
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      autoComplete="name"
                      className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                      {contact.form.fields.emailLabel}{" "}
                      <span className="text-rose-400">{contact.form.fields.emailRequiredSuffix}</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-foreground">
                      {contact.form.fields.companyLabel}
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                      {contact.form.fields.focusLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <Button type="submit">{contact.form.submitLabel}</Button>
              </form>
            </CardContent>
          </Card>
          <ContactShortcuts shortcuts={contact.shortcuts} />
        </Container>
      </section>
    </div>
  );
}
