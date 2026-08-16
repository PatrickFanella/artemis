import { useParams, Link } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { CrewRoster } from "@/components/CrewRoster";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { getMission } from "@/api/missions";

export function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: mission, loading, error } = useQuery(() => getMission(id!), [id], SSR_KEYS.mission(id!));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!mission) return <ErrorMessage message="Mission not found" />;

  const launchDate = mission.launch_date
    ? new Date(mission.launch_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "TBD";

  return (
    <div>
      <SeoHead
        title={`${mission.name} — NASA Artemis Mission`}
        description={`${mission.tagline}. ${mission.description}`}
        canonicalPath={`/missions/${mission.id}`}
        image={mission.image_url}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Campaign", path: "/missions" }, { name: mission.name, path: `/missions/${mission.id}` }]}
      />
      <PageHeader title={mission.name} subtitle={mission.tagline} />

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <StatusBadge status={mission.status} />
        <span className="text-muted text-sm">Launch: {launchDate}</span>
        <span className="text-muted text-sm">Duration: {mission.duration}</span>
      </div>

      <p className="text-secondary max-w-3xl leading-relaxed mb-8">{mission.description}</p>
      <CrewRoster crew={mission.crew} />

      <div className="mt-8">
        <Link to={`/schedule?mission=${mission.id}`} className="inline-flex items-center gap-1.5 text-artemis-blue hover:text-artemis-blue/80 text-sm font-medium transition-colors">
          View Mission Schedule →
        </Link>
      </div>
    </div>
  );
}