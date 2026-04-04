import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MediaCard } from "@/components/MediaCard";
import { MediaDetail } from "@/components/MediaDetail";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useQuery } from "@/hooks/useQuery";
import { searchMedia } from "@/api/media";
import type { MediaAsset } from "@/lib/types";

const mediaTypes = [
  { key: "", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
];

export function MediaPage() {
  const [query, setQuery] = useState("artemis II");
  const [search, setSearch] = useState("artemis II");
  const [mediaType, setMediaType] = useState("");
  const [selected, setSelected] = useState<MediaAsset | null>(null);

  const fetcher = useCallback(
    () => searchMedia(search, mediaType || undefined),
    [search, mediaType]
  );
  const { data, loading, error } = useQuery(fetcher, [search, mediaType]);

  return (
    <div>
      <PageHeader
        title="Media Gallery"
        subtitle="Images and videos from NASA's Artemis program"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query);
          }}
          className="flex-1 flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NASA media..."
            className="flex-1 glass-card px-4 py-2 text-sm focus:outline-none focus:border-artemis-blue/40 focus:shadow-[0_0_12px_rgba(59,130,246,0.1)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-artemis-blue rounded-xl text-sm font-medium hover:bg-artemis-blue/80 transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
          >
            Search
          </button>
        </form>
        <div className="flex gap-2">
          {mediaTypes.map((t) => (
            <button
              key={t.key}
              onClick={() => setMediaType(t.key)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                mediaType === t.key
                  ? "bg-artemis-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                  : "glass-card text-lunar-white/60 hover:text-lunar-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : data && data.items.length > 0 ? (
        <>
          <p className="text-sm text-lunar-white/40 mb-4">
            {data.total_hits.toLocaleString()} results
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((asset) => (
              <MediaCard
                key={asset.nasa_id}
                asset={asset}
                onClick={() => setSelected(asset)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-lunar-white/40">
          No media found
        </div>
      )}

      {selected && (
        <MediaDetail asset={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
