import { Link } from "react-router";
import { StatusBadge } from "./StatusBadge";
import type { Mission } from "@/lib/types";

export function MissionCard({ mission }: { mission: Mission }) {
  const launchDate = mission.launch_date
    ? new Date(mission.launch_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBD";

  return (
    <Link
      to={`/missions/${mission.id}`}
      className="block glass-card glass-card-hover p-6 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-display font-semibold tracking-tight group-hover:text-artemis-blue transition-colors">
          {mission.name}
        </h3>
        <StatusBadge status={mission.status} />
      </div>
      <p className="text-lunar-white/50 text-sm mb-4">{mission.tagline}</p>
      <div className="flex items-center gap-4 text-xs text-lunar-white/40">
        <span>Launch: {launchDate}</span>
        <span>Duration: {mission.duration}</span>
        {mission.crew.length > 0 && <span>Crew: {mission.crew.length}</span>}
      </div>
    </Link>
  );
}
