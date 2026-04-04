import { useParams, Link } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { CrewRoster } from "@/components/CrewRoster";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useQuery } from "@/hooks/useQuery";
import { getMission } from "@/api/missions";

export function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: mission,
    loading,
    error,
  } = useQuery(() => getMission(id!), [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!mission) return <ErrorMessage message="Mission not found" />;

  const launchDate = mission.launch_date
    ? new Date(mission.launch_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBD";

  return (
    <div>
      <PageHeader title={mission.name} subtitle={mission.tagline} />

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <StatusBadge status={mission.status} />
        <span className="text-lunar-white/50 text-sm">
          Launch: {launchDate}
        </span>
        <span className="text-lunar-white/50 text-sm">
          Duration: {mission.duration}
        </span>
      </div>

      <p className="text-lunar-white/70 mb-8 max-w-3xl leading-relaxed">
        {mission.description}
      </p>

      <CrewRoster crew={mission.crew} />

      <div className="mt-8">
        <Link
          to={`/schedule?mission=${mission.id}`}
          className="inline-flex items-center gap-2 text-artemis-blue hover:text-artemis-blue/80 transition-colors"
        >
          View Mission Schedule →
        </Link>
      </div>
    </div>
  );
}
