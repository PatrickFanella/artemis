import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UpdateCard } from "@/components/UpdateCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useQuery } from "@/hooks/useQuery";
import { getUpdates } from "@/api/updates";

const sources = [
  { key: "", label: "All" },
  { key: "artemis_blog", label: "Artemis Blog" },
  { key: "nasa_news", label: "NASA News" },
  { key: "iotd", label: "Image of the Day" },
];

export function UpdatesPage() {
  const [source, setSource] = useState("");

  const fetcher = useCallback(() => getUpdates(source || undefined, 50), [source]);
  const { data: updates, loading, error } = useQuery(fetcher, [source]);

  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <PageHeader
        title="Latest Updates"
        subtitle="News and updates from the Artemis program"
      />

      <div className="flex gap-2 mb-6">
        {sources.map((s) => (
          <button
            key={s.key}
            onClick={() => setSource(s.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              source === s.key
                ? "bg-artemis-blue text-white"
                : "bg-space-dark border border-space-gray/50 text-lunar-white/60 hover:text-lunar-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : updates && updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-lunar-white/40">
          No updates found
        </div>
      )}
    </div>
  );
}
