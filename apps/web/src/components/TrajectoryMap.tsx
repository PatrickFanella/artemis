import type { Trajectory } from "@/lib/types";

/**
 * SVG visualization of the Earth-Moon trajectory arc.
 * Shows Earth on the left, Moon on the right, with a curved path and
 * the spacecraft position interpolated along it.
 */
export function TrajectoryMap({
  trajectory,
}: {
  trajectory: Trajectory;
  missionProgress?: number;
}) {
  const width = 800;
  const height = 200;
  const earthX = 80;
  const moonX = 720;
  const midY = 100;

  const maxDistance = 384400;
  const earthDist = trajectory.distance_from_earth_km;
  const normPos = Math.min(earthDist / maxDistance, 1.0);

  // Spacecraft position along the trajectory arc
  const scX = earthX + normPos * (moonX - earthX);
  // Arc curve: rises in the middle, flat at endpoints
  const arcHeight = 60;
  const scY = midY - Math.sin(normPos * Math.PI) * arcHeight;

  // Path points for the trajectory arc
  const pathMidX = (earthX + moonX) / 2;
  const pathCtrlY = midY - arcHeight - 20;

  // Progress color based on phase
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
        <span className="text-xs px-2 py-0.5 rounded-full bg-space-gray/30 border border-white/[0.06] text-lunar-white/60 backdrop-blur-sm">
          {trajectory.phase_label}
        </span>
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
        <text
          x={earthX}
          y={midY + 34}
          textAnchor="middle"
          fill="#f0f0f5"
          fontSize="11"
          opacity="0.5"
        >
          Earth
        </text>

        {/* Moon */}
        <circle cx={moonX} cy={midY} r="18" fill="rgba(156,163,175,0.08)" />
        <circle cx={moonX} cy={midY} r="12" fill="url(#moonGrad)" />
        <text
          x={moonX}
          y={midY + 28}
          textAnchor="middle"
          fill="#f0f0f5"
          fontSize="11"
          opacity="0.5"
        >
          Moon
        </text>

        {/* Spacecraft */}
        <g>
          {/* Outer glow */}
          <circle cx={scX} cy={scY} r="12" fill={phaseColor} opacity="0.08" />
          <circle cx={scX} cy={scY} r="8" fill={phaseColor} opacity="0.15" />
          <circle cx={scX} cy={scY} r="5" fill={phaseColor} opacity="0.3" />
          {/* Ship dot */}
          <circle cx={scX} cy={scY} r="4" fill={phaseColor} />
          <circle cx={scX} cy={scY} r="2.5" fill="white" />
          {/* Label */}
          <text
            x={scX}
            y={scY - 16}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
            style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.4))" }}
          >
            ORION
          </text>
        </g>

        {/* Distance labels */}
        <text
          x={earthX + 40}
          y={midY + 50}
          fill="#f0f0f5"
          fontSize="10"
          opacity="0.35"
        >
          {formatDistanceShort(trajectory.distance_from_earth_km)} from Earth
        </text>
        <text
          x={moonX - 40}
          y={midY + 50}
          textAnchor="end"
          fill="#f0f0f5"
          fontSize="10"
          opacity="0.35"
        >
          {formatDistanceShort(trajectory.distance_from_moon_km)} to Moon
        </text>

        {/* Velocity */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fill="#f0f0f5"
          fontSize="10"
          opacity="0.35"
        >
          {trajectory.velocity_kmh.toLocaleString()} km/h
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
            {formatDistance(trajectory.distance_from_earth_km)}
          </p>
          <p className="text-xs text-lunar-white/40">From Earth</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-display font-bold text-artemis-gold">
            {trajectory.velocity_kmh.toLocaleString()}
          </p>
          <p className="text-xs text-lunar-white/40">km/h</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-display font-bold text-lunar-white/80">
            {formatDistance(trajectory.distance_from_moon_km)}
          </p>
          <p className="text-xs text-lunar-white/40">To Moon</p>
        </div>
      </div>
    </div>
  );
}

function formatDistance(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${Math.round(km)} km`;
}

function formatDistanceShort(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(0)}k km`;
  return `${Math.round(km)} km`;
}
