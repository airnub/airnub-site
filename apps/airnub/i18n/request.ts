import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "./routing";

type Messages = typeof import("../messages/en-US.json");

type MessageModule = { default: Messages };

const loaders: Record<Locale, () => Promise<MessageModule>> = {
  "en-US": () => import("../messages/en-US.json"),
  "en-GB": () => import("../messages/en-GB.json"),
  ga: () => import("../messages/ga.json"),
  fr: () => import("../messages/fr.json"),
  es: () => import("../messages/es.json"),
  de: () => import("../messages/de.json"),
  pt: () => import("../messages/pt.json"),
  it: () => import("../messages/it.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const normalizedLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  const loadMessages = loaders[normalizedLocale] ?? loaders[defaultLocale];
  const { default: messages } = await loadMessages();

  return {
    locale: normalizedLocale,
    messages: messages as unknown as AbstractIntlMessages,
  };
});
