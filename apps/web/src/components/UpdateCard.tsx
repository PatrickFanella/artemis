import type { BlogUpdate } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const sourceLabels: Record<string, string> = {
  artemis_blog: "Artemis Blog",
  nasa_news: "NASA News",
  iotd: "Image of the Day",
};

const sourceColors: Record<string, string> = {
  artemis_blog: "bg-artemis-gold/20 text-artemis-gold",
  nasa_news: "bg-artemis-blue/20 text-artemis-blue",
  iotd: "bg-purple-500/20 text-purple-400",
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
      className="block bg-space-dark border border-space-gray/50 rounded-xl p-5 hover:border-artemis-blue/50 transition-colors group"
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
              className={`text-xs px-2 py-0.5 rounded-full ${sourceColors[update.source] ?? "bg-space-gray text-lunar-white/60"}`}
            >
              {sourceLabels[update.source] ?? update.source}
            </span>
            <span className="text-xs text-lunar-white/40">{timeAgo}</span>
          </div>
          <h3 className="font-medium group-hover:text-artemis-blue transition-colors line-clamp-2">
            {update.title}
          </h3>
          {update.summary && (
            <p className="text-lunar-white/50 text-sm mt-1 line-clamp-2">
              {update.summary}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
