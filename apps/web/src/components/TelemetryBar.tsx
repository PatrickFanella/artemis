import type { TelemetrySnapshot } from "@/lib/types";

function formatDistance(km: number): string {
  if (km >= 1000) {
    return `${(km / 1000).toFixed(1)}k`;
  }
  return km.toLocaleString();
}

function TelemetryStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-artemis-gold">{value}</p>
      <p className="text-xs text-lunar-white/50 uppercase tracking-wider">
        {unit}
      </p>
      <p className="text-xs text-lunar-white/30 mt-1">{label}</p>
    </div>
  );
}

export function TelemetryBar({
  telemetry,
}: {
  telemetry: TelemetrySnapshot;
}) {
  return (
    <div className="bg-space-dark border border-space-gray/50 rounded-xl p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <TelemetryStat
          label="Mission Elapsed"
          value={telemetry.mission_elapsed || "--"}
          unit="time"
        />
        <TelemetryStat
          label="From Earth"
          value={formatDistance(telemetry.distance_from_earth)}
          unit="km"
        />
        <TelemetryStat
          label="From Moon"
          value={formatDistance(telemetry.distance_from_moon)}
          unit="km"
        />
        <TelemetryStat
          label="Velocity"
          value={telemetry.velocity.toLocaleString()}
          unit="km/h"
        />
      </div>
      {!telemetry.is_live && (
        <div className="mt-4 text-center">
          <p className="text-xs text-lunar-white/40 mb-1">
            Sample data — not live
          </p>
          <a
            href={telemetry.tracker_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors"
          >
            Track live on NASA AROW →
          </a>
        </div>
      )}
    </div>
  );
}
