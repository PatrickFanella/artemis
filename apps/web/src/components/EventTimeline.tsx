import type { MissionEvent } from "@/lib/types";

const categoryColors: Record<string, string> = {
  propulsion: "cat-propulsion",
  navigation: "cat-navigation",
  crew: "cat-crew",
  communication: "cat-communication",
  system: "cat-system",
  science: "cat-science",
};

const categoryIcons: Record<string, string> = {
  propulsion: "\u{1F525}", navigation: "\u{1F9ED}", crew: "\u{1F468}\u200D\u{1F680}",
  communication: "\u{1F4E1}", system: "\u2699\uFE0F", science: "\u{1F52C}",
};

function formatMET(seconds: number): string {
  const d = Math.floor(seconds / 86400), h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (d > 0) return `T+${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
  return `T+${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatLocalTime(launchDate: string, metSeconds: number): string {
  return new Date(new Date(launchDate).getTime() + metSeconds * 1000).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatTimeAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatCountdown(seconds: number): string {
  if (seconds < 60) return `in ${seconds}s`;
  if (seconds < 3600) return `in ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) { const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); return `in ${h}h ${m}m`; }
  const d = Math.floor(seconds / 86400); const h = Math.floor((seconds % 86400) / 3600);
  return `in ${d}d ${h}h`;
}

function EventRow({
  event, currentMet, launchDate, compact,
}: {
  event: MissionEvent; currentMet: number; launchDate?: string; compact?: boolean;
}) {
  const isActive = event.status === "active";
  const isCompleted = event.status === "completed";
  const timeDiff = Math.abs(currentMet - event.met_seconds);

  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors ${
      isActive ? "bg-status-active/8 border border-status-active/20" :
      isCompleted ? "opacity-50" : "hover:bg-space-slate/20"
    }`}>
      <div className="mt-1 shrink-0">
        {isActive ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-active" />
          </span>
        ) : isCompleted ? (
          <span className="flex h-2.5 w-2.5 rounded-full bg-status-completed/50" />
        ) : (
          <span className="flex h-2.5 w-2.5 rounded-full border border-default bg-space-dark" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`label ${categoryColors[event.category] || "bg-space-slate/30 text-muted border-subtle"} px-1.5 py-0.5 rounded border`}>
            {categoryIcons[event.category]} {event.category}
          </span>
          <span className="met-display text-xs text-faint">
            {formatMET(event.met_seconds)}
            {event.duration_seconds ? ` – ${formatMET(event.met_seconds + event.duration_seconds)}` : ""}
          </span>
          {launchDate && (
            <span className="text-xs text-artemis-cyan/70">
              {formatLocalTime(launchDate, event.met_seconds)}
            </span>
          )}
          {!compact && (
            <span className="text-xs text-faint">
              {isCompleted ? formatTimeAgo(timeDiff) : formatCountdown(timeDiff)}
            </span>
          )}
        </div>
        <h4 className={`font-medium text-sm mt-0.5 ${isActive ? "text-status-active" : ""}`}>{event.title}</h4>
        {!compact && <p className="text-muted text-sm mt-0.5 line-clamp-2">{event.description}</p>}
      </div>
    </div>
  );
}

export function EventTimeline({
  events, currentMet, launchDate, title, compact,
}: {
  events: MissionEvent[]; currentMet: number; launchDate?: string; title?: string; compact?: boolean;
}) {
  if (!events.length) return null;
  return (
    <div>
      {title && <h3 className="label text-muted mb-3">{title}</h3>}
      <div className="space-y-0.5">
        {events.map((event) => (
          <EventRow key={event.id} event={event} currentMet={currentMet} launchDate={launchDate} compact={compact} />
        ))}
      </div>
    </div>
  );
}

export function CurrentEventCard({
  event, label, accent, launchDate,
}: {
  event: MissionEvent; label: string; accent: "green" | "blue"; launchDate?: string;
}) {
  const borderClass = accent === "green" ? "border-status-active/30" : "border-artemis-blue/30";
  const glowClass = accent === "green" ? "glow-green" : "glow-blue";

  return (
    <div className={`panel ${borderClass} p-4 ${glowClass}`}>
      <div className="flex items-center gap-2 mb-2">
        {accent === "green" && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-active" />
          </span>
        )}
        <span className="label text-muted">{label}</span>
        <span className={`label ${categoryColors[event.category] || ""} px-1.5 py-0.5 rounded border`}>
          {categoryIcons[event.category]} {event.category}
        </span>
      </div>
      <h3 className="font-display font-semibold text-base">{event.title}</h3>
      <p className="text-secondary text-sm mt-1">{event.description}</p>
      <div className="met-display text-xs text-faint mt-2">
        {formatMET(event.met_seconds)} · FD{event.flight_day.toString().padStart(2, "0")}
        {launchDate && <span className="text-artemis-cyan/60 ml-2">{formatLocalTime(launchDate, event.met_seconds)}</span>}
      </div>
    </div>
  );
}