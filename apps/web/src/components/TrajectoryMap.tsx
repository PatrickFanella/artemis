import { useState, useEffect } from "react";
import type { Trajectory } from "@/lib/types";

const KM_TO_MI = 0.621371;

function useUnits() {
  const [imperial, setImperial] = useState(() => {
    try { return localStorage.getItem("artemis-units") === "imperial"; }
    catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("artemis-units", imperial ? "imperial" : "metric"); }
    catch { /* noop */ }
  }, [imperial]);
  return { imperial, toggle: () => setImperial((v) => !v) };
}

function fmtDist(km: number, imperial: boolean): string {
  if (imperial) {
    const mi = km * KM_TO_MI;
    if (mi >= 1000) return `${(mi / 1000).toFixed(1)}k mi`;
    return `${Math.round(mi)} mi`;
  }
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${Math.round(km)} km`;
}

function fmtDistShort(km: number, imperial: boolean): string {
  if (imperial) {
    const mi = km * KM_TO_MI;
    if (mi >= 1000) return `${(mi / 1000).toFixed(0)}k mi`;
    return `${Math.round(mi)} mi`;
  }
  if (km >= 1000) return `${(km / 1000).toFixed(0)}k km`;
  return `${Math.round(km)} km`;
}

function fmtSpeed(kmh: number, imperial: boolean): string {
  const val = imperial ? kmh * KM_TO_MI : kmh;
  return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/**
 * SVG visualization of the Earth-Moon trajectory arc.
 */
export function TrajectoryMap({
  trajectory,
}: {
  trajectory: Trajectory;
  missionProgress?: number;
}) {
  const { imperial, toggle } = useUnits();
  const speedUnit = imperial ? "mph" : "km/h";

  const width = 800;
  const height = 200;
  const earthX = 80;
  const moonX = 720;
  const midY = 100;

  const maxDistance = 384400;
  const earthDist = trajectory.distance_from_earth_km;
  const normPos = Math.min(earthDist / maxDistance, 1.0);

  const scX = earthX + normPos * (moonX - earthX);
  const arcHeight = 60;
  const scY = midY - Math.sin(normPos * Math.PI) * arcHeight;

  const pathMidX = (earthX + moonX) / 2;
  const pathCtrlY = midY - arcHeight - 20;

  const phaseColor =
    trajectory.phase === "closest_approach"
      ? "#f59e0b"
      : trajectory.phase.includes("return") ||
          trajectory.phase === "reentry" ||
          trajectory.phase === "splashdown"
        ? "#ef4444"
        : "#3b82f6";

  return (
    <div className="glass-card p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-lunar-white/50 uppercase tracking-wider">
          Trajectory
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="text-xs px-2 py-0.5 rounded-full bg-space-gray/30 border border-white/[0.06] text-lunar-white/60 backdrop-blur-sm hover:border-artemis-blue/30 hover:text-lunar-white transition-colors"
            aria-label="Toggle units"
          >
            {imperial ? "mi / mph" : "km / km/h"}
          </button>
          <span className="text-xs px-2 py-0.5 rounded-full bg-space-gray/30 border border-white/[0.06] text-lunar-white/60 backdrop-blur-sm">
            {trajectory.phase_label}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        aria-label="Spacecraft trajectory from Earth to Moon"
      >
        {/* Background stars */}
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={Math.random() * width}
            cy={Math.random() * height}
            r={Math.random() * 1.2 + 0.3}
            fill="white"
            opacity={Math.random() * 0.3 + 0.1}
          />
        ))}

        {/* Trajectory arc (full path) */}
        <path
          d={`M ${earthX} ${midY} Q ${pathMidX} ${pathCtrlY} ${moonX} ${midY}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Traveled path */}
        <path
          d={`M ${earthX} ${midY} Q ${pathMidX} ${pathCtrlY} ${moonX} ${midY}`}
          fill="none"
          stroke={phaseColor}
          strokeWidth="2"
          strokeDasharray={`${normPos * 800} 800`}
          opacity="0.6"
        />

        {/* Traveled path glow */}
        <path
          d={`M ${earthX} ${midY} Q ${pathMidX} ${pathCtrlY} ${moonX} ${midY}`}
          fill="none"
          stroke={phaseColor}
          strokeWidth="6"
          strokeDasharray={`${normPos * 800} 800`}
          opacity="0.1"
          filter="url(#pathGlow)"
        />

        {/* Earth */}
        <circle cx={earthX} cy={midY} r="24" fill={`${phaseColor}10`} />
        <circle cx={earthX} cy={midY} r="18" fill="url(#earthGrad)" />
        <text x={earthX} y={midY + 34} textAnchor="middle" fill="#f0f0f5" fontSize="11" opacity="0.5">
          Earth
        </text>

        {/* Moon */}
        <circle cx={moonX} cy={midY} r="18" fill="rgba(156,163,175,0.08)" />
        <circle cx={moonX} cy={midY} r="12" fill="url(#moonGrad)" />
        <text x={moonX} y={midY + 28} textAnchor="middle" fill="#f0f0f5" fontSize="11" opacity="0.5">
          Moon
        </text>

        {/* Spacecraft */}
        <g>
          <circle cx={scX} cy={scY} r="12" fill={phaseColor} opacity="0.08" />
          <circle cx={scX} cy={scY} r="8" fill={phaseColor} opacity="0.15" />
          <circle cx={scX} cy={scY} r="5" fill={phaseColor} opacity="0.3" />
          <circle cx={scX} cy={scY} r="4" fill={phaseColor} />
          <circle cx={scX} cy={scY} r="2.5" fill="white" />
          <text
            x={scX} y={scY - 16} textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold"
            style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.4))" }}
          >
            ORION
          </text>
        </g>

        {/* Distance labels */}
        <text x={earthX + 40} y={midY + 50} fill="#f0f0f5" fontSize="10" opacity="0.35">
          {fmtDistShort(trajectory.distance_from_earth_km, imperial)} from Earth
        </text>
        <text x={moonX - 40} y={midY + 50} textAnchor="end" fill="#f0f0f5" fontSize="10" opacity="0.35">
          {fmtDistShort(trajectory.distance_from_moon_km, imperial)} to Moon
        </text>

        {/* Velocity */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fill="#f0f0f5" fontSize="10" opacity="0.35">
          {fmtSpeed(trajectory.velocity_kmh, imperial)} {speedUnit}
        </text>

        {/* Gradients & Filters */}
        <defs>
          <radialGradient id="earthGrad">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </radialGradient>
          <radialGradient id="moonGrad">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="60%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </radialGradient>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
      </svg>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/[0.06]">
        <div className="text-center">
          <p className="text-lg font-display font-bold text-artemis-blue">
            {fmtDist(trajectory.distance_from_earth_km, imperial)}
          </p>
          <p className="text-xs text-lunar-white/40">From Earth</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-display font-bold text-artemis-gold">
            {fmtSpeed(trajectory.velocity_kmh, imperial)}
          </p>
          <p className="text-xs text-lunar-white/40">{speedUnit}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-display font-bold text-lunar-white/80">
            {fmtDist(trajectory.distance_from_moon_km, imperial)}
          </p>
          <p className="text-xs text-lunar-white/40">To Moon</p>
        </div>
      </div>
    </div>
  );
}
