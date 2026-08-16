import type { MediaAsset } from "@/lib/types";

export function MediaDetail({ asset, onClose }: { asset: MediaAsset; onClose: () => void }) {
  const src = asset.large_url || asset.preview_url;

  return (
    <div className="fixed inset-0 z-50 bg-space-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {src && <img src={src} alt={asset.title} className="w-full rounded-t-lg" />}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-space-black/70 rounded-full flex items-center justify-center text-lunar-white/80 hover:text-lunar-white border border-default transition-colors"
          >✕</button>
        </div>
        <div className="p-5">
          <h2 className="text-xl font-display font-semibold mb-2">{asset.title}</h2>
          <div className="flex items-center gap-3 text-sm text-muted mb-4">
            <span>{asset.center}</span>
            {asset.photographer && <span>Photo: {asset.photographer}</span>}
            {asset.date_created && <span>{new Date(asset.date_created).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
          </div>
          {asset.description && <p className="text-secondary text-sm leading-relaxed mb-4">{asset.description}</p>}
          {asset.keywords && asset.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {asset.keywords.slice(0, 10).map((kw) => (
                <span key={kw} className="text-xs px-2 py-1 rounded-full text-muted border border-subtle bg-space-slate/30">{kw}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}