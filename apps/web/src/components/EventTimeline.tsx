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
  propulsion: "\u{1F525}",
  navigation: "\u{1F9ED}",
  crew: "\u{1F468}\u200D\u{1F680}",
  communication: "\u{1F4E1}",
  system: "\u2699\uFE0F",
  science: "\u{1F52C}",
};

function formatMET(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) {
    return `T+${d.toString().padStart(2, "0")}:${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `T+${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatLocalTime(launchDate: string, metSeconds: number): string {
  const eventTime = new Date(new Date(launchDate).getTime() + metSeconds * 1000);
  return eventTime.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCountdown(seconds: number): string {
  if (seconds < 60) return `in ${seconds}s`;
  if (seconds < 3600) return `in ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `in ${h}h ${m}m`;
  }
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return `in ${d}d ${h}h`;
}

function formatTimeAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    return `${h}h ago`;
  }
  const d = Math.floor(seconds / 86400);
  return `${d}d ago`;
}

function EventRow({
  event,
  currentMet,
  launchDate,
  compact,
}: {
  event: MissionEvent;
  currentMet: number;
  launchDate?: string;
  compact?: boolean;
}) {
  const isActive = event.status === "active";
  const isCompleted = event.status === "completed";
  const timeDiff = Math.abs(currentMet - event.met_seconds);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
        isActive
          ? "bg-status-active/8 border border-status-active/20 shadow-[0_0_12px_rgba(34,197,94,0.06)]"
          : isCompleted
            ? "opacity-60"
            : "hover:bg-white/[0.03]"
      }`}
    >
      {/* Status dot */}
      <div className="mt-1.5 flex-shrink-0">
        {isActive ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-status-active" />
          </span>
        ) : isCompleted ? (
          <span className="flex h-3 w-3 rounded-full bg-status-completed/60" />
        ) : (
          <span className="flex h-3 w-3 rounded-full border border-white/10 bg-space-dark" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-1.5 py-0.5 rounded border backdrop-blur-sm ${categoryColors[event.category] || "bg-space-gray/20 text-lunar-white/50 border-space-gray/30"}`}>
            {categoryIcons[event.category] || "\u2022"} {event.category}
          </span>
          <span className="met-display text-xs text-lunar-white/40">
            {formatMET(event.met_seconds)}
          </span>
          {launchDate && (
            <span className="text-xs text-artemis-cyan/60">
              {formatLocalTime(launchDate, event.met_seconds)}
            </span>
          )}
          {!compact && (
            <span className="text-xs text-lunar-white/30">
              {isCompleted
                ? formatTimeAgo(timeDiff)
                : formatCountdown(timeDiff)}
            </span>
          )}
        </div>
        <h4
          className={`font-medium mt-1 ${isActive ? "text-status-active" : ""}`}
        >
          {event.title}
        </h4>
        {!compact && (
          <p className="text-sm text-lunar-white/40 mt-0.5 line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function EventTimeline({
  events,
  currentMet,
  launchDate,
  title,
  compact,
}: {
  events: MissionEvent[];
  currentMet: number;
  launchDate?: string;
  title?: string;
  compact?: boolean;
}) {
  if (!events.length) return null;

  return (
    <div>
      {title && (
        <h3 className="text-sm font-medium text-lunar-white/50 uppercase tracking-wider mb-3">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            currentMet={currentMet}
            launchDate={launchDate}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

export function CurrentEventCard({
  event,
  label,
  accent,
  launchDate,
}: {
  event: MissionEvent;
  label: string;
  accent: "green" | "blue";
  launchDate?: string;
}) {
  const borderColor = accent === "green" ? "border-status-active/30" : "border-artemis-blue/30";
  const glowClass = accent === "green" ? "glow-green" : "glow-blue";

  return (
    <div className={`glass-card border ${borderColor} p-4 ${glowClass}`}>
      <div className="flex items-center gap-2 mb-2">
        {accent === "green" && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-active" />
          </span>
        )}
        <span className="text-xs font-medium uppercase tracking-wider text-lunar-white/50">
          {label}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded border backdrop-blur-sm ${categoryColors[event.category] || ""}`}>
          {categoryIcons[event.category]} {event.category}
        </span>
      </div>
      <h3 className="font-display font-semibold text-lg">{event.title}</h3>
      <p className="text-sm text-lunar-white/50 mt-1">{event.description}</p>
      <div className="met-display text-xs text-lunar-white/30 mt-2">
        {formatMET(event.met_seconds)} · FD{event.flight_day.toString().padStart(2, "0")}
        {launchDate && (
          <span className="text-artemis-cyan/50 ml-2">
            {formatLocalTime(launchDate, event.met_seconds)}
          </span>
        )}
      </div>
    </div>
  );
}
