import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { loadMessages } from "@airnub/i18n";
import { defaultLocale, locales, type Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const normalizedLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  const messages = await loadMessages("adf", normalizedLocale);

  return {
    locale: normalizedLocale,
    messages: messages as unknown as AbstractIntlMessages,
  };
});
