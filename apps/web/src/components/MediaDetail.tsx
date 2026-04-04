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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-space-dark border border-space-gray/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
            className="absolute top-4 right-4 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
          >
            X
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{asset.title}</h2>
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
            <p className="text-lunar-white/70 text-sm leading-relaxed mb-4">
              {asset.description}
            </p>
          )}
          {asset.keywords && asset.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {asset.keywords.slice(0, 10).map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-2 py-1 bg-space-gray/50 rounded-full text-lunar-white/50"
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
