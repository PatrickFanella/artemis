import { StatusBadge } from "./StatusBadge";
import { MilestoneItem } from "./MilestoneItem";
import type { MissionSection, Milestone } from "@/lib/types";

export function TimelineSection({
  section,
  milestones,
}: {
  section: MissionSection;
  milestones: Milestone[];
}) {
  const dotColor =
    section.status === "completed"
      ? "bg-status-completed"
      : section.status === "active"
        ? "bg-status-active animate-pulse"
        : "bg-space-gray";

  return (
    <div className="relative pl-10">
      <div
        className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full ${dotColor} ring-4 ring-space-black`}
      />
      <div className="bg-space-dark border border-space-gray/50 rounded-xl p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">{section.name}</h3>
            <span className="text-xs text-lunar-white/40">
              {section.day_range}
            </span>
          </div>
          <StatusBadge status={section.status} />
        </div>
        <p className="text-lunar-white/60 text-sm mb-4">
          {section.description}
        </p>
        {milestones.length > 0 && (
          <div className="space-y-2 border-t border-space-gray/30 pt-3">
            {milestones.map((m) => (
              <MilestoneItem key={m.id} milestone={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
