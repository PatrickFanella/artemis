import type { Milestone } from "@/lib/types";

export function MilestoneItem({ milestone }: { milestone: Milestone }) {
  const isCompleted = milestone.completed_at != null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? "bg-status-completed" : "bg-space-gray"}`}
      />
      <span className={isCompleted ? "text-lunar-white/50" : ""}>
        {milestone.title}
      </span>
      {milestone.planned_at && (
        <span className="text-lunar-white/30 text-xs ml-auto">
          {new Date(milestone.planned_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}
