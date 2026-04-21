export type QueryParams = Record<string, unknown>;

export const serializeQueryParams = (params: QueryParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      const nextValue = value.filter((item) => item !== undefined && item !== null && item !== '').join(',');
      if (nextValue) searchParams.set(key, nextValue);
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

export const buildUrl = (
  url: string,
  params?: QueryParams,
  serializer: (params: QueryParams) => string = serializeQueryParams
) => {
  if (!params) return url;
  const query = serializer(params);
  if (!query) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${query}`;
};

export async function fetchJson<T>(
  url: string,
  options?: {
    params?: QueryParams;
    headers?: HeadersInit;
    signal?: AbortSignal;
    paramsSerializer?: (params: QueryParams) => string;
  }
): Promise<T> {
  const resolvedUrl = buildUrl(url, options?.params, options?.paramsSerializer ?? serializeQueryParams);
  const response = await fetch(resolvedUrl, {
    method: 'GET',
    headers: options?.headers,
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export const fetchText = async (
  url: string,
  options?: {
    params?: QueryParams;
    headers?: HeadersInit;
    signal?: AbortSignal;
    paramsSerializer?: (params: QueryParams) => string;
  }
) => {
  const resolvedUrl = buildUrl(url, options?.params, options?.paramsSerializer ?? serializeQueryParams);
  const response = await fetch(resolvedUrl, {
    method: 'GET',
    headers: options?.headers,
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return await response.text();
};
