import type { MediaAsset } from "@/lib/types";

export function MediaCard({
  asset,
  onClick,
}: {
  asset: MediaAsset;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left group rounded-xl overflow-hidden bg-space-dark border border-space-gray/50 hover:border-artemis-blue/50 transition-colors"
    >
      <div className="aspect-video relative overflow-hidden bg-space-gray">
        {asset.preview_url ? (
          <img
            src={asset.preview_url}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lunar-white/20">
            No preview
          </div>
        )}
        {asset.media_type === "video" && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
            Video
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-artemis-blue transition-colors">
          {asset.title}
        </h3>
        <p className="text-xs text-lunar-white/40 mt-1">{asset.center}</p>
      </div>
    </button>
  );
}
