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
      className="block panel panel-hover p-5 group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-display font-semibold tracking-tight group-hover:text-artemis-blue transition-colors">
          {mission.name}
        </h3>
        <StatusBadge status={mission.status} />
      </div>
      <p className="text-muted text-sm mb-3 text-balance">{mission.tagline}</p>
      <div className="flex items-center gap-4 label text-faint">
        <span>{launchDate}</span>
        <span>{mission.duration}</span>
        {mission.crew.length > 0 && <span>{mission.crew.length} crew</span>}
      </div>
    </Link>
  );
}