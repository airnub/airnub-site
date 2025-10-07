import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { assertLocale } from "../../../i18n/routing";

export const revalidate = 86_400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const hire = await getTranslations({ locale, namespace: "pages.hire" });

  return {
    title: hire("metadata.title"),
    description: hire("metadata.description"),
  };
}

export default async function HirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const hire = await getTranslations({ locale, namespace: "pages.hire" });
  const sections = hire.raw("sections") as {
    offer: { title: string; items: { title: string; description: string }[] };
    whyNow: { title: string; description: string };
    engagements: { title: string; items: { title: string; description: string }[] };
    contact: { title: string; description: string; email: string };
  };

  const [contactPrefix = "", contactSuffix = ""] = sections.contact.description.split("{email}");

  return (
    <article className="prose mx-auto px-6 py-10">
      <h1>{hire("metadata.title")}</h1>
      <p>{hire("intro")}</p>

      <h2>{sections.offer.title}</h2>
      <ul>
        {sections.offer.items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}:</strong> {item.description}
          </li>
        ))}
      </ul>

      <h2>{sections.whyNow.title}</h2>
      <p>{sections.whyNow.description}</p>

      <h2>{sections.engagements.title}</h2>
      <ul>
        {sections.engagements.items.map((item) => (
          <li key={item.title}>
            <strong>{item.title}:</strong> {item.description}
          </li>
        ))}
      </ul>

      <h2>{sections.contact.title}</h2>
      <p>
        {contactPrefix}
        <a href={`mailto:${sections.contact.email}`}>{sections.contact.email}</a>
        {contactSuffix}
      </p>
    </article>
  );
}
