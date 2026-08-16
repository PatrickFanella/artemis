/**
 * Build-time prerender (SSG) driver.
 *
 * Bundled by `vite build --ssr` and run with Node.  Fetches data from the
 * API, renders each route to static HTML, and writes the output into `dist/`.
 *
 * If the API is unreachable the script skips prerendering with a warning
 * (the build still succeeds as a normal SPA).
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { setSSRData, ssrDataScript } from "@/lib/ssrData";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { render } from "@/entry-server";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_URL = process.env.PRERENDER_API_URL ?? "https://artemis.subcult.tv";
const DIST = resolve(process.cwd(), "dist");

// ---------------------------------------------------------------------------
// SEO metadata per route (mirrors SeoHead in each page component)
// ---------------------------------------------------------------------------

interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  image?: string;
}

const SEO: Record<string, SeoMeta> = {
  "/": {
    title: "NASA Artemis Mission Updates, Media & Timeline",
    description:
      "Follow NASA's Artemis lunar program. Mission updates, media gallery, crew profiles, event timeline, and campaign schedule for Artemis I through V.",
    canonical: "/",
  },
  "/missions": {
    title: "Artemis Campaign — All Missions",
    description:
      "The full NASA Artemis campaign from Artemis I through Artemis V — mission objectives, launch dates, durations, and crew rosters.",
    canonical: "/missions",
  },
  "/schedule": {
    title: "Artemis II Schedule",
    description:
      "Day-by-day mission timeline and event schedule for NASA's Artemis II. Flight days, trajectory corrections, lunar flyby, and splashdown.",
    canonical: "/schedule",
  },
  "/updates": {
    title: "Mission Updates",
    description:
      "Latest news and updates from NASA's Artemis program — Artemis blog, NASA news, and image of the day, refreshed throughout the day.",
    canonical: "/updates",
  },
  "/media": {
    title: "Media Gallery",
    description:
      "Images and videos from NASA's Artemis program. Searchable gallery of official NASA mission photography, launch footage, and lunar imagery.",
    canonical: "/media",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchJSON<T>(path: string): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<T>;
}

function applySeo(html: string, meta: SeoMeta): string {
  const fullTitle = `${meta.title} — Artemis Hub`;
  const base = "https://artemis.subcult.tv";
  const canonical = `${base}${meta.canonical}`;

  return html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escapeAttr(meta.description)}">`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${escapeAttr(canonical)}">`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${escapeAttr(fullTitle)}">`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${escapeAttr(canonical)}">`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*">/,
      `<meta name="twitter:title" content="${escapeAttr(fullTitle)}">`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*">/,
      `<meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    )
    .replace(
      /<meta property="og:image" content="[^"]*">/,
      `<meta property="og:image" content="${escapeAttr(meta.image ?? `${base}/og-image.png`)}">`,
    )
    .replace(
      /<meta name="twitter:image" content="[^"]*">/,
      `<meta name="twitter:image" content="${escapeAttr(meta.image ?? `${base}/og-image.png`)}">`,
    );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function writePage(path: string, html: string): void {
  const filePath = join(DIST, path, "index.html");
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, "utf-8");
  console.log(`  wrote ${path}/index.html`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\n[prerender] fetching data from ${API_URL} …`);

  // ---------- fetch data ----------
  let missions: any[];
  let latestUpdates: any[];
  let allUpdates: any[];
  let homeMedia: any;
  let pageMedia: any;

  try {
    [missions, latestUpdates, allUpdates, homeMedia, pageMedia] =
      await Promise.all([
        fetchJSON<any[]>("/api/v1/missions"),
        fetchJSON<any[]>("/api/v1/updates/latest"),
        fetchJSON<any[]>("/api/v1/updates?limit=50"),
        fetchJSON<any>("/api/v1/media?q=artemis+ii&type=image"),
        fetchJSON<any>("/api/v1/media?q=artemis+II"),
      ]);
  } catch (err: any) {
    console.warn(`[prerender] API unreachable — skipping prerender (${err.message})`);
    process.exit(0);
  }

  // ---------- per-mission data ----------
  const missionData: Record<string, any> = {};
  for (const m of missions) {
    const id = m.id;
    try {
      const [sections, milestones, events] = await Promise.all([
        fetchJSON<any[]>(`/api/v1/missions/${id}/sections`),
        fetchJSON<any[]>(`/api/v1/missions/${id}/milestones`),
        fetchJSON<any>(`/api/v1/missions/${id}/events`),
      ]);
      missionData[id] = { sections, milestones, events };
    } catch {
      console.warn(`[prerender] could not fetch data for mission ${id}`);
    }
  }

  // ---------- build SSR data map ----------
  const ssrData: Record<string, unknown> = {
    [SSR_KEYS.missions]: missions,
    [SSR_KEYS.latestUpdates]: latestUpdates,
    [SSR_KEYS.updatesPage]: allUpdates,
    [SSR_KEYS.homeMedia]: homeMedia,
    [SSR_KEYS.mediaPage]: pageMedia,
  };

  for (const m of missions) {
    const d = missionData[m.id];
    if (!d) continue;
    ssrData[SSR_KEYS.mission(m.id)] = m;
    ssrData[SSR_KEYS.sections(m.id)] = d.sections;
    ssrData[SSR_KEYS.milestones(m.id)] = d.milestones;
    ssrData[SSR_KEYS.events(m.id)] = d.events;
  }

  // ---------- read template ----------
  const template = readFileSync(join(DIST, "index.html"), "utf-8");

  // ---------- render each route ----------
  const routes = [
    "/",
    "/missions",
    ...missions.map((m: any) => `/missions/${m.id}`),
    "/schedule",
    "/updates",
    "/media",
  ];

  console.log(`[prerender] rendering ${routes.length} routes …`);

  for (const path of routes) {
    setSSRData(ssrData);
    const appHtml = render(path);

    let meta = SEO[path];
    if (!meta && path.startsWith("/missions/")) {
      const id = path.split("/").pop()!;
      const m = missions.find((x: any) => x.id === id);
      if (m) {
        meta = {
          title: `${m.name} — NASA Artemis Mission`,
          description: `${m.tagline}. ${m.description}`,
          canonical: path,
          image: m.image_url || undefined,
        };
      }
    }
    if (!meta) {
      console.warn(`[prerender] no SEO metadata for ${path}, skipping`);
      continue;
    }

    let html = applySeo(template, meta);
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );
    // Inject SSR data script before the closing body tag
    html = html.replace("</body>", `${ssrDataScript()}\n</body>`);

    writePage(path, html);
  }

  console.log("[prerender] done\n");
}

main().catch((err) => {
  console.error("[prerender] fatal:", err);
  process.exit(1);
});