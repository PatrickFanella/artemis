import { PageHeader } from "@/components/PageHeader";
import { MissionCard } from "@/components/MissionCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useQuery } from "@/hooks/useQuery";
import { getMissions } from "@/api/missions";

export function MissionsPage() {
  const { data: missions, loading, error } = useQuery(getMissions);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <PageHeader
        title="Artemis Campaign"
        subtitle="NASA's program to return humans to the Moon and establish a sustained presence"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions?.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}
