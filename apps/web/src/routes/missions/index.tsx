import { PageHeader } from "@/components/PageHeader";
import { MissionCard } from "@/components/MissionCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { getMissions } from "@/api/missions";

const programFacts = [
  { label: "Missions Planned", value: "5+" },
  { label: "Lunar Destination", value: "South Pole" },
  { label: "Primary Rocket", value: "SLS" },
  { label: "Spacecraft", value: "Orion" },
  { label: "Program Goal", value: "Return to the Moon & beyond" },
];

export function MissionsPage() {
  const { data: missions, loading, error } = useQuery(getMissions, [], SSR_KEYS.missions);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const completed = missions?.filter((m) => m.status === "completed").length ?? 0;
  const upcoming = missions?.filter((m) => m.status === "upcoming").length ?? 0;
  const active = missions?.filter((m) => m.status === "active").length ?? 0;

  return (
    <div>
      <SeoHead title="Artemis Campaign" description="The full NASA Artemis campaign from Artemis I through Artemis V." canonicalPath="/missions" />
      <PageHeader
        title="Artemis Campaign"
        subtitle="NASA's program to return humans to the Moon, establish a sustainable presence, and prepare for Mars"
      />

      {/* Campaign status summary */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="panel p-4 text-center">
          <p className="text-2xl font-display font-bold text-status-completed">{completed}</p>
          <p className="label text-faint mt-1">Completed</p>
        </div>
        <div className="panel p-4 text-center">
          <p className="text-2xl font-display font-bold text-status-active">{active}</p>
          <p className="label text-faint mt-1">In Flight</p>
        </div>
        <div className="panel p-4 text-center">
          <p className="text-2xl font-display font-bold text-status-upcoming">{upcoming}</p>
          <p className="label text-faint mt-1">Upcoming</p>
        </div>
      </div>

      {/* Program facts */}
      <div className="panel p-5 mb-10">
        <h2 className="label text-muted mb-4">Program Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {programFacts.map((f) => (
            <div key={f.label}>
              <p className="font-display font-semibold text-sm">{f.value}</p>
              <p className="text-faint text-xs mt-0.5">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission cards */}
      <h2 className="text-lg font-display font-semibold tracking-tight mb-4">Missions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions?.map((mission) => <MissionCard key={mission.id} mission={mission} />)}
      </div>
    </div>
  );
}