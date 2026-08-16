import type { MediaAsset } from "@/lib/types";

export function MediaCard({ asset, onClick }: { asset: MediaAsset; onClick: () => void }) {
  const src = asset.large_url || asset.preview_url;

  return (
    <button onClick={onClick} className="text-left w-full panel panel-hover overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-space-slate/30">
        {src ? (
          <img
            src={src}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint text-xs">No preview</div>
        )}
        {asset.media_type === "video" && (
          <div className="absolute top-2 right-2 bg-space-black/70 text-xs px-2 py-0.5 rounded border border-subtle text-muted">
            Video
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 leading-snug">{asset.title}</h3>
        <p className="text-faint text-xs mt-1">{asset.center}</p>
      </div>
    </button>
  );
}