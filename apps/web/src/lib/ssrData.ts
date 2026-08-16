/**
 * SSR data injection layer for build-time prerendering (SSG).
 *
 * During prerender, the build script populates a global data map before
 * calling renderToString.  Components read their initial state from this
 * map so the prerendered HTML contains real content instead of loading
 * spinners.
 *
 * On the client, the same map is embedded as `window.__ARTEMIS_SSR__` so
 * React hydration sees the same initial data and avoids a mismatch.
 */

type SSRData = Record<string, unknown>;

const g = globalThis as { __ARTEMIS_SSR__?: SSRData };

/** Set the SSR data map (called by the prerender script). */
export function setSSRData(data: SSRData): void {
  g.__ARTEMIS_SSR__ = data;
}

/** Read a value from the SSR data map. Returns null if the key is absent. */
export function getSSRData<T = unknown>(key: string): T | null {
  const data = g.__ARTEMIS_SSR__;
  if (!data || !(key in data)) return null;
  return data[key] as T;
}

/** Serialise the SSR data map for embedding in the HTML document. */
export function ssrDataScript(): string {
  const data = g.__ARTEMIS_SSR__;
  if (!data) return "";
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script>window.__ARTEMIS_SSR__=${json}</script>`;
}