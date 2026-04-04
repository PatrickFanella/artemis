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
  const timeAgo = formatDistanceToNow(new Date(update.published_at), {
    addSuffix: true,
  });

  return (
    <a
      href={update.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card glass-card-hover p-5 group"
    >
      <div className="flex items-start gap-4">
        {update.image_url && (
          <img
            src={update.image_url}
            alt=""
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border backdrop-blur-sm ${sourceColors[update.source] ?? "bg-space-gray/50 text-lunar-white/60 border-space-gray/30"}`}
            >
              {sourceLabels[update.source] ?? update.source}
            </span>
            <span className="text-xs text-lunar-white/40">{timeAgo}</span>
          </div>
          <h3 className="font-medium group-hover:text-artemis-blue transition-colors line-clamp-2">
            {update.title}
          </h3>
          {update.summary && (
            <p className="text-lunar-white/40 text-sm mt-1 line-clamp-2">
              {update.summary}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
