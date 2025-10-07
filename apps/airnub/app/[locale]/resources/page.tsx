import { redirect } from "next/navigation";

import { assertLocale } from "../../../i18n/routing";

export default async function ResourcesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);

  redirect(`/${locale}/projects`);
}
