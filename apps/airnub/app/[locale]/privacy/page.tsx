import { assertLocale } from "../../../i18n/routing";

export const metadata = { title: "Privacy" };

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);

  return (
    <main className="prose mx-auto p-8">
      <h1>Privacy</h1>
      <p>
        We collect minimal usage data to improve the website experience. If analytics are enabled, we use privacy-friendly
        measurement and never sell or share personal data.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href="mailto:hello@airnub.io">hello@airnub.io</a>.
      </p>
    </main>
  );
}
