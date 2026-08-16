import type { BlogUpdate } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const sourceLabels: Record<string, string> = {
  artemis_blog: "Artemis Blog",
  nasa_news: "NASA News",
  iotd: "Image of the Day",
};

const sourceColors: Record<string, string> = {
  artemis_blog: "bg-artemis-gold/15 text-artemis-gold border-artemis-gold/20",
  nasa_news: "bg-artemis-blue/15 text-artemis-blue border-artemis-blue/20",
  iotd: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

export function UpdateCard({ update }: { update: BlogUpdate }) {
  const timeAgo = formatDistanceToNow(new Date(update.published_at), { addSuffix: true });

  return (
    <a
      href={update.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block panel panel-hover p-4"
    >
      <div className="flex items-start gap-3">
        {update.image_url && (
          <img src={update.image_url} alt="" className="w-14 h-14 rounded-md object-cover shrink-0" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`label ${sourceColors[update.source] ?? "bg-space-slate/50 text-muted border-subtle"} px-1.5 py-0.5 rounded border`}>
              {sourceLabels[update.source] ?? update.source}
            </span>
            <span className="text-faint text-xs">{timeAgo}</span>
          </div>
          <h3 className="text-sm font-medium line-clamp-2">{update.title}</h3>
          {update.summary && <p className="text-muted text-sm mt-0.5 line-clamp-2">{update.summary}</p>}
        </div>
      </div>
    </a>
  );
}