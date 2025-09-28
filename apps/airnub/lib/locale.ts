export function localeHref(locale: string, path: string) {
  if (!path.startsWith("/")) {
    return path;
  }
  const [pathname, hash = ""] = path.split("#");
  const prefixedPath = `/${locale}${pathname}`;
  return hash ? `${prefixedPath}#${hash}` : prefixedPath;
}
