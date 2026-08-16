import type { CrewMember } from "@/lib/types";

export function CrewRoster({ crew }: { crew: CrewMember[] }) {
  if (crew.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-display font-semibold tracking-tight mb-4">Crew</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {crew.map((member) => (
          <div key={member.name} className="panel p-4">
            <div className="w-10 h-10 rounded-full bg-artemis-blue/10 border border-artemis-blue/20 flex items-center justify-center mb-3 text-sm font-display font-bold text-artemis-blue">
              {member.name[0]}
            </div>
            <h3 className="font-medium text-sm">{member.name}</h3>
            <p className="text-artemis-gold text-xs mt-0.5">{member.role}</p>
            <p className="text-muted text-xs mt-2 leading-relaxed line-clamp-3">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}