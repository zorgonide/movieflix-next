/* eslint-disable @typescript-eslint/no-explicit-any */
// utility functions for various common tasks

import { FetchArgs } from "./types";

const baseUrl = (tmdb?: boolean) =>
  tmdb
    ? process.env.NEXT_PUBLIC_TMDB_BASE_URL
    : process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL || ""
    : "";
const cache = new Map<string, any>();

async function handleFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fetch error ${response.status}: ${errorText}`);
  }

  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

/** Generic GET with cache */
export const fget = async ({
  url,
  useCache = true,
  tmdb = false,
}: FetchArgs) => {
  if (useCache && cache.has(url)) return cache.get(url);
  const fullUrl = `${baseUrl(tmdb)}${url}`;
  const res = await handleFetch(fullUrl);
  if (useCache) cache.set(url, res);
  return res;
};

/** PATCH with cache */
export const fpatch = async ({
  url,
  data,
  useCache = false,
  tmdb = false,
}: FetchArgs) => {
  if (useCache && cache.has(url)) return cache.get(url);
  const fullUrl = `${baseUrl(tmdb)}${url}`;
  const res = await handleFetch(fullUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (useCache) cache.set(url, res);
  return res;
};

/** POST with cache */
export const fpost = async ({
  url,
  data,
  useCache = false,
  tmdb = false,
}: FetchArgs) => {
  if (useCache && cache.has(url)) return cache.get(url);
  const fullUrl = `${baseUrl(tmdb)}${url}`;
  const res = await handleFetch(fullUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (useCache) cache.set(url, res);
  return res;
};

/** DELETE */
export const fdelete = async ({ url, tmdb = false }: FetchArgs) => {
  const fullUrl = `${baseUrl(tmdb)}${url}`;
  return handleFetch(fullUrl, { method: "DELETE" });
};
