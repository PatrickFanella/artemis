import { useState, useCallback } from "react";
import { useSearchParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { MediaCard } from "@/components/MediaCard";
import { MediaDetail } from "@/components/MediaDetail";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { searchMedia } from "@/api/media";
import type { MediaAsset } from "@/lib/types";

const mediaTypes = [
  { key: "", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
];

const quickSearches = [
  "Artemis II",
  "Artemis I",
  "Orion spacecraft",
  "Space Launch System",
  "Artemis III",
  "Lunar Gateway",
  "Moon",
  "Launch",
];

export function MediaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [search, setSearch] = useState(initialQ);
  const [mediaType, setMediaType] = useState("");
  const [selected, setSelected] = useState<MediaAsset | null>(null);

  const fetcher = useCallback(
    () => searchMedia(search || "artemis", mediaType || undefined),
    [search, mediaType],
  );
  const { data, loading, error } = useQuery(fetcher, [search, mediaType], SSR_KEYS.mediaPage);

  const submit = (q: string) => {
    setQuery(q);
    setSearch(q);
    setSearchParams(q ? { q } : {});
  };

  return (
    <div>
      <SeoHead title="Media Gallery" description="NASA Artemis mission images and videos." canonicalPath="/media" />
      <PageHeader title="Media Gallery" subtitle="Images and videos from NASA's Artemis program" />

      {/* Search bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(query); }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search NASA media…"
          className="flex-1 panel px-4 py-2.5 text-sm focus:outline-none focus:border-artemis-blue/40"
        />
        <button type="submit" className="px-5 py-2.5 bg-artemis-blue rounded-lg text-sm font-medium text-white hover:bg-artemis-blue/85 transition-colors">
          Search
        </button>
      </form>

      {/* Quick search chips */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {quickSearches.map((q) => (
          <button
            key={q}
            onClick={() => submit(q)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              search === q
                ? "bg-artemis-blue/15 text-artemis-blue border-artemis-blue/30"
                : "panel text-muted hover:text-secondary hover:border-default"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Media type filter */}
      <div className="flex gap-1.5 mb-6">
        {mediaTypes.map((t) => (
          <button
            key={t.key}
            onClick={() => setMediaType(t.key)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              mediaType === t.key ? "bg-artemis-blue text-white" : "panel panel-hover text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : data && data.items.length > 0 ? (
        <>
          <p className="text-muted text-sm mb-4">{data.total_hits.toLocaleString()} results</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.items.map((asset) => (
              <MediaCard key={asset.nasa_id} asset={asset} onClick={() => setSelected(asset)} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-muted">Search NASA's media library — try a quick search above</div>
      )}
      {selected && <MediaDetail asset={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}