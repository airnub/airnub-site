import { cookies } from "next/headers";
import { defaultLanguage, languageCookieName, supportedLanguages, type SupportedLanguage } from "../i18n/config";

export async function getCurrentLanguage(): Promise<SupportedLanguage> {
  const cookieStore = await cookies();
  const value = cookieStore.get(languageCookieName)?.value as SupportedLanguage | undefined;
  if (value && supportedLanguages.includes(value)) {
    return value;
  }
  return defaultLanguage;
}
