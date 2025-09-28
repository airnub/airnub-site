import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./routing";

type Messages = typeof import("../messages/en.json");

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const normalizedLocale =
    locale && locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale;

  let messages: Messages;

  switch (normalizedLocale) {
    case "es":
      messages = (await import("../messages/es.json")).default;
      break;
    case "en":
    default:
      messages = (await import("../messages/en.json")).default;
      break;
  }

  return {
    locale: normalizedLocale,
    messages,
  };
});
