import type { CrewMember } from "@/lib/types";

export function CrewRoster({ crew }: { crew: CrewMember[] }) {
  if (crew.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Crew</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {crew.map((member) => (
          <div
            key={member.name}
            className="bg-space-dark border border-space-gray/50 rounded-lg p-4"
          >
            <div className="w-12 h-12 rounded-full bg-space-gray flex items-center justify-center mb-3 text-lg font-bold text-artemis-blue">
              {member.name[0]}
            </div>
            <h3 className="font-medium">{member.name}</h3>
            <p className="text-artemis-gold text-sm mb-2">{member.role}</p>
            <p className="text-lunar-white/50 text-xs">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
