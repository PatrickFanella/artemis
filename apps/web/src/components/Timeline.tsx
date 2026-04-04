import { TimelineSection } from "./TimelineSection";
import type { MissionSection, Milestone } from "@/lib/types";

export function Timeline({
  sections,
  milestones,
}: {
  sections: MissionSection[];
  milestones: Milestone[];
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-space-gray/50" />
      <div className="space-y-6">
        {sections.map((section) => (
          <TimelineSection
            key={section.id}
            section={section}
            milestones={milestones.filter(
              (m) => m.section_id === section.id
            )}
          />
        ))}
      </div>
    </div>
  );
}
