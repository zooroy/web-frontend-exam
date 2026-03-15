interface ServerApiFetchOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export function buildServerApiUrl(
  requestHeaders: Headers,
  pathname: string,
  searchParams?: URLSearchParams,
) {
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
  const host =
    requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');

  if (!host) {
    throw new Error('Missing host header');
  }

  const url = new URL(pathname, `${protocol}://${host}`);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url.toString();
}

export async function fetchServerJson<T>(
  requestHeaders: Headers,
  pathname: string,
  searchParams?: URLSearchParams,
  options: ServerApiFetchOptions = {},
) {
  const response = await fetch(
    buildServerApiUrl(requestHeaders, pathname, searchParams),
    {
      cache: options.cache ?? 'no-store',
      next:
        typeof options.revalidate === 'number'
          ? { revalidate: options.revalidate }
          : undefined,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${pathname}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
