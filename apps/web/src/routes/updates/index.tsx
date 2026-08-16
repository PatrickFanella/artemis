import { useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { UpdateCard } from "@/components/UpdateCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { getUpdates } from "@/api/updates";

const sources = [
  { key: "", label: "All" },
  { key: "article", label: "Articles" },
  { key: "artemis_blog", label: "Artemis Blog" },
  { key: "nasa_news", label: "NASA News" },
  { key: "iotd", label: "Image of the Day" },
];

export function UpdatesPage() {
  const [source, setSource] = useState("");
  const fetcher = useCallback(() => getUpdates(source || undefined, 50), [source]);
  const { data: updates, loading, error } = useQuery(fetcher, [source], SSR_KEYS.updatesPage);

  return (
    <div>
      <SeoHead title="Mission Updates" description="Latest news from NASA's Artemis program." canonicalPath="/updates" />
      <PageHeader title="Mission Updates" subtitle="News and updates from the Artemis program" />

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {sources.map((s) => (
          <button key={s.key} onClick={() => setSource(s.key)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${source === s.key ? "bg-artemis-blue text-white" : "panel panel-hover text-secondary"}`}>{s.label}</button>
        ))}
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? <LoadingSpinner /> : updates && updates.length > 0 ? (
        <div className="space-y-2">{updates.map((update) => <UpdateCard key={update.id} update={update} />)}</div>
      ) : (
        <div className="text-center py-12 text-muted">No updates found</div>
      )}
    </div>
  );
}