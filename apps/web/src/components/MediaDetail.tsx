import type { MediaAsset } from "@/lib/types";

export function MediaDetail({
  asset,
  onClose,
}: {
  asset: MediaAsset;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-space-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {asset.preview_url && (
            <img
              src={asset.preview_url}
              alt={asset.title}
              className="w-full rounded-t-xl"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 border border-white/10 transition-colors"
          >
            X
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-display font-semibold mb-2">{asset.title}</h2>
          <div className="flex items-center gap-3 text-sm text-lunar-white/50 mb-4">
            <span>{asset.center}</span>
            {asset.photographer && <span>Photo: {asset.photographer}</span>}
            {asset.date_created && (
              <span>
                {new Date(asset.date_created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          {asset.description && (
            <p className="text-lunar-white/60 text-sm leading-relaxed mb-4">
              {asset.description}
            </p>
          )}
          {asset.keywords && asset.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {asset.keywords.slice(0, 10).map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2 py-1 bg-space-gray/30 backdrop-blur-sm rounded-full text-lunar-white/50 border border-white/[0.04]"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
