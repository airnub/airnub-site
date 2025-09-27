export interface ServerFetchInit extends Omit<RequestInit, "next"> {
  next?: RequestInit["next"];
  /**
   * Convenience hook for configuring Next.js cache revalidation. When provided, it is merged
   * with any `next` options supplied on the request.
   */
  revalidate?: number | false;
}

/**
 * Wrapper around the platform `fetch` API that ensures Next.js cache options are consistently
 * applied while returning strongly typed JSON data.
 */
export async function serverFetch<TJson = unknown>(
  input: RequestInfo | URL,
  init?: ServerFetchInit,
): Promise<TJson> {
  const { revalidate, next, ...rest } = init ?? {};
  const nextOptions: NonNullable<RequestInit["next"]> = {
    ...(next ?? {}),
  };

  if (typeof revalidate !== "undefined") {
    nextOptions.revalidate = revalidate;
  }

  const requestInit: RequestInit = {
    ...rest,
    ...(Object.keys(nextOptions).length > 0 ? { next: nextOptions } : {}),
  };

  const response = await fetch(input, requestInit);

  if (!response.ok) {
    const target =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    throw new Error(`Failed to fetch ${target}: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TJson;
}
