import { useParams, Link } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { CrewRoster } from "@/components/CrewRoster";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { getMission } from "@/api/missions";
import { searchMedia } from "@/api/media";

export function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: mission, loading, error } = useQuery(() => getMission(id!), [id], SSR_KEYS.mission(id!));
  const { data: media } = useQuery(() => searchMedia(mission?.name ?? "", "image"), [mission?.name]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!mission) return <ErrorMessage message="Mission not found" />;

  const launchDate = mission.launch_date
    ? new Date(mission.launch_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "TBD";

  const stats = [
    { label: "Status", value: <StatusBadge status={mission.status} /> },
    { label: "Launch", value: launchDate },
    { label: "Duration", value: mission.duration },
    { label: "Crew", value: mission.crew.length > 0 ? `${mission.crew.length} astronauts` : "Uncrewed" },
  ];

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

      <Breadcrumbs
        items={[
          { name: "Campaign", path: "/missions" },
          { name: mission.name },
        ]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="panel p-4 text-center">
            <div className="text-sm">{s.value}</div>
            <p className="label text-faint mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-secondary max-w-3xl leading-relaxed mb-8">{mission.description}</p>

      {/* Crew */}
      <CrewRoster crew={mission.crew} />

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to={`/schedule?mission=${mission.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-artemis-blue text-white hover:bg-artemis-blue/85 transition-colors"
        >
          View Mission Schedule →
        </Link>
        <Link
          to={`/media?q=${encodeURIComponent(mission.name)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium panel panel-hover text-secondary hover:text-lunar-white transition-colors"
        >
          Mission Media →
        </Link>
      </div>

      {/* Mission media gallery */}
      {media && media.items.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-display font-semibold tracking-tight mb-4">Mission Media</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {media.items.slice(0, 8).map((asset) => (
              <a
                key={asset.nasa_id}
                href={asset.large_url || asset.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video rounded-md overflow-hidden bg-space-slate/30 border border-subtle group"
              >
                <img
                  src={asset.preview_url}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}