import { useState, useEffect } from "react";
import type { Trajectory } from "@/lib/types";

const KM_TO_MI = 0.621371;

function useUnits() {
  const [imperial, setImperial] = useState(() => {
    try { return localStorage.getItem("artemis-units") === "imperial"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("artemis-units", imperial ? "imperial" : "metric"); } catch { /* noop */ }
  }, [imperial]);
  return { imperial, toggle: () => setImperial((v) => !v) };
}

function fmtDist(km: number, imperial: boolean): string {
  if (imperial) { const mi = km * KM_TO_MI; return mi >= 1000 ? `${(mi / 1000).toFixed(1)}k mi` : `${Math.round(mi)} mi`; }
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${Math.round(km)} km`;
}

function fmtDistShort(km: number, imperial: boolean): string {
  if (imperial) { const mi = km * KM_TO_MI; return mi >= 1000 ? `${(mi / 1000).toFixed(0)}k mi` : `${Math.round(mi)} mi`; }
  return km >= 1000 ? `${(km / 1000).toFixed(0)}k km` : `${Math.round(km)} km`;
}

function fmtSpeed(kmh: number, imperial: boolean): string {
  return (imperial ? kmh * KM_TO_MI : kmh).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function TrajectoryMap({ trajectory }: { trajectory: Trajectory; missionProgress?: number }) {
  const { imperial, toggle } = useUnits();
  const speedUnit = imperial ? "mph" : "km/h";

  const width = 800, height = 200, earthX = 80, moonX = 720, midY = 100;
  const maxDistance = 384400;
  const earthDist = trajectory.distance_from_earth_km;
  const normPos = Math.min(earthDist / maxDistance, 1.0);
  const scX = earthX + normPos * (moonX - earthX);
  const arcHeight = 60;
  const scY = midY - Math.sin(normPos * Math.PI) * arcHeight;
  const pathMidX = (earthX + moonX) / 2;
  const pathCtrlY = midY - arcHeight - 20;

  const phaseColor =
    trajectory.phase === "closest_approach" ? "#C2892A" :
    trajectory.phase.includes("return") || trajectory.phase === "reentry" || trajectory.phase === "splashdown" ? "#E53935" :
    "#2962FF";

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="label text-muted">Trajectory</h3>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="text-xs px-2 py-1 rounded border border-subtle text-muted hover:text-secondary hover:border-default transition-colors">
            {imperial ? "mi / mph" : "km / km/h"}
          </button>
          <span className="text-xs px-2 py-1 rounded border border-subtle text-muted bg-space-slate/30">{trajectory.phase_label}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-label="Spacecraft trajectory from Earth to Moon">
        <path d={`M ${earthX} ${midY} Q ${pathMidX} ${pathCtrlY} ${moonX} ${midY}`} fill="none" stroke="color-mix(in oklab, var(--color-lunar-white) 8%, transparent)" strokeWidth="2" strokeDasharray="6 4" />
        <path d={`M ${earthX} ${midY} Q ${pathMidX} ${pathCtrlY} ${moonX} ${midY}`} fill="none" stroke={phaseColor} strokeWidth="2" strokeDasharray={`${normPos * 800} 800`} opacity="0.5" />
        <path d={`M ${earthX} ${midY} Q ${pathMidX} ${pathCtrlY} ${moonX} ${midY}`} fill="none" stroke={phaseColor} strokeWidth="6" strokeDasharray={`${normPos * 800} 800`} opacity="0.08" filter="url(#pathGlow)" />
        <circle cx={earthX} cy={midY} r="24" fill={`${phaseColor}10`} />
        <circle cx={earthX} cy={midY} r="18" fill="url(#earthGrad)" />
        <text x={earthX} y={midY + 34} textAnchor="middle" fill="#E6EAF0" fontSize="11" opacity="0.4">Earth</text>
        <circle cx={moonX} cy={midY} r="18" fill="rgba(156,163,175,0.06)" />
        <circle cx={moonX} cy={midY} r="12" fill="url(#moonGrad)" />
        <text x={moonX} y={midY + 28} textAnchor="middle" fill="#E6EAF0" fontSize="11" opacity="0.4">Moon</text>
        <g>
          <circle cx={scX} cy={scY} r="12" fill={phaseColor} opacity="0.06" />
          <circle cx={scX} cy={scY} r="8" fill={phaseColor} opacity="0.1" />
          <circle cx={scX} cy={scY} r="5" fill={phaseColor} opacity="0.25" />
          <circle cx={scX} cy={scY} r="4" fill={phaseColor} />
          <circle cx={scX} cy={scY} r="2.5" fill="#E6EAF0" />
          <text x={scX} y={scY - 14} textAnchor="middle" fill={phaseColor} fontSize="9" fontWeight="bold" opacity="0.8">ORION</text>
        </g>
        <text x={earthX + 40} y={midY + 50} fill="#E6EAF0" fontSize="10" opacity="0.3">{fmtDistShort(trajectory.distance_from_earth_km, imperial)} from Earth</text>
        <text x={moonX - 40} y={midY + 50} textAnchor="end" fill="#E6EAF0" fontSize="10" opacity="0.3">{fmtDistShort(trajectory.distance_from_moon_km, imperial)} to Moon</text>
        <text x={width / 2} y={height - 10} textAnchor="middle" fill="#E6EAF0" fontSize="10" opacity="0.3">{fmtSpeed(trajectory.velocity_kmh, imperial)} {speedUnit}</text>
        <defs>
          <radialGradient id="earthGrad"><stop offset="0%" stopColor="#60a5fa" /><stop offset="60%" stopColor="#2962FF" /><stop offset="100%" stopColor="#1e40af" /></radialGradient>
          <radialGradient id="moonGrad"><stop offset="0%" stopColor="#d1d5db" /><stop offset="60%" stopColor="#9ca3af" /><stop offset="100%" stopColor="#6b7280" /></radialGradient>
          <filter id="pathGlow"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
      </svg>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-subtle">
        <div className="text-center"><p className="text-lg font-display font-bold text-artemis-blue">{fmtDist(trajectory.distance_from_earth_km, imperial)}</p><p className="text-faint text-xs mt-0.5">From Earth</p></div>
        <div className="text-center"><p className="text-lg font-display font-bold text-artemis-gold">{fmtSpeed(trajectory.velocity_kmh, imperial)}</p><p className="text-faint text-xs mt-0.5">{speedUnit}</p></div>
        <div className="text-center"><p className="text-lg font-display font-bold text-lunar-white/80">{fmtDist(trajectory.distance_from_moon_km, imperial)}</p><p className="text-faint text-xs mt-0.5">To Moon</p></div>
      </div>
    </div>
  );
}