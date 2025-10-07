import { assertLocale } from "../../i18n/routing";
import adfBrand from "../../../brand.config";

export const metadata = { title: "Privacy" };

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const contactEmail =
    adfBrand.contact.security ?? adfBrand.contact.support ?? adfBrand.contact.general ?? "hello@airnub.io";

  return (
    <article className="prose mx-auto p-8" lang={locale}>
      <h1>Privacy</h1>
      <p>
        We only collect the information required to publish ADF documentation and community resources. Analytics are disabled
        unless explicitly configured via environment variables. We never sell or share personal data.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </article>
  );
}
