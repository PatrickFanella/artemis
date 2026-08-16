import { useEffect } from "react";

interface Breadcrumb {
  name: string;
  path: string;
}

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  breadcrumbs?: Breadcrumb[];
}

const BASE_URL = "https://artemis.subcult.tv";

/**
 * Sets per-route <title>, meta description, OG tags, and canonical URL.
 * Use once per route component to give each page its own SEO surface.
 * Optionally renders BreadcrumbList JSON-LD and a page-specific OG image.
 */
export function SeoHead({
  title,
  description,
  canonicalPath,
  image,
  breadcrumbs,
}: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} — Artemis Hub`;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);

    if (image) {
      setMeta("og:image", image);
      setMeta("twitter:image", image);
    }

    if (canonicalPath) {
      setLinkCanonical(`${BASE_URL}${canonicalPath}`);
      setMeta("og:url", `${BASE_URL}${canonicalPath}`);
    } else {
      setLinkCanonical(BASE_URL);
      setMeta("og:url", BASE_URL);
    }

    setBreadcrumbSchema(breadcrumbs);
  }, [title, description, canonicalPath, image, breadcrumbs]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setBreadcrumbSchema(breadcrumbs?: Breadcrumb[]) {
  const id = "breadcrumb-schema";
  let el = document.getElementById(id) as HTMLScriptElement | null;

  if (!breadcrumbs || breadcrumbs.length === 0) {
    el?.remove();
    return;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.path}`,
    })),
  };

  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}