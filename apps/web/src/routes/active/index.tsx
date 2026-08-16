import { Link } from "react-router";
import { StatusBadge } from "@/components/StatusBadge";
import { MissionClockDisplay } from "@/components/MissionClock";
import { TrajectoryMap } from "@/components/TrajectoryMap";
import { EventTimeline, CurrentEventCard } from "@/components/EventTimeline";
import { MissionLinksBar } from "@/components/MissionLinks";
import { DashboardSection } from "@/components/DashboardSection";
import { UpdateCard } from "@/components/UpdateCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery, useLiveQuery } from "@/hooks/useQuery";
import { getActiveDashboard } from "@/api/active";
import { getLatestUpdates } from "@/api/updates";
import { searchMedia } from "@/api/media";

function BetweenMissions() {
  const { data: updates } = useQuery(getLatestUpdates);
  const { data: media } = useQuery(() => searchMedia("artemis ii", "image"));

  return (
    <div className="space-y-8">
      <SeoHead title="Mission Status" description="Current status of NASA's Artemis program." canonicalPath="/active" />
      <div className="panel p-8 text-center">
        <span className="label text-muted">Mission Status</span>
        <h1 className="text-2xl font-display font-bold tracking-tight mt-3 mb-2">Between Missions</h1>
        <p className="text-secondary max-w-lg mx-auto">No mission is currently in flight. Explore updates and media from the last flight.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/updates" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-artemis-blue text-white hover:bg-artemis-blue/85 transition-colors">Mission updates →</Link>
          <Link to="/media" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium panel panel-hover text-secondary hover:text-lunar-white transition-colors">Mission media →</Link>
        </div>
      </div>

      {updates && updates.length > 0 && (
        <DashboardSection title="Latest Updates" action={<Link to="/updates" className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors">View all →</Link>}>
          <div className="space-y-2">{updates.slice(0, 5).map((u) => <UpdateCard key={u.id} update={u} />)}</div>
        </DashboardSection>
      )}
      {media && media.items.length > 0 && (
        <DashboardSection title="Mission Media" action={<Link to="/media" className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors">View gallery →</Link>}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {media.items.slice(0, 6).map((asset) => (
              <div key={asset.nasa_id} className="aspect-video rounded-md overflow-hidden bg-space-slate/30 border border-subtle">
                {asset.preview_url && <img src={asset.large_url || asset.preview_url} alt={asset.title} className="w-full h-full object-cover" loading="lazy" />}
              </div>
            ))}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}

export function ActivePage() {
  const { data: dashboard, loading, error } = useLiveQuery(getActiveDashboard, 30_000);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboard) return <BetweenMissions />;

  const { mission, clock, trajectory, current_event, next_event, recent_events, upcoming_events, telemetry, latest_updates, latest_media, links } = dashboard;

  return (
    <div className="space-y-8">
      <SeoHead title="Mission Status" description={`Live mission dashboard for ${mission.name}.`} canonicalPath="/active" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-display font-bold tracking-tight">{mission.name}</h1>
            <StatusBadge status={mission.status} />
          </div>
          <p className="text-muted text-balance">{mission.tagline}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-active" />
          </span>
          {telemetry.is_live ? "Live" : "Data stream"}
        </div>
      </div>

      {/* Clock + Trajectory (top row) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MissionClockDisplay clock={clock} />
        </div>
        <div className="lg:col-span-2">
          <TrajectoryMap trajectory={trajectory} />
        </div>
      </div>

      {/* Current + Next Event */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current_event && <CurrentEventCard event={current_event} label="Current" accent="green" launchDate={mission.launch_date ?? undefined} />}
        {next_event && <CurrentEventCard event={next_event} label="Up Next" accent="blue" launchDate={mission.launch_date ?? undefined} />}
      </div>

      {/* Events timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recent_events.length > 0 && <EventTimeline events={recent_events} currentMet={clock.met_seconds} launchDate={mission.launch_date ?? undefined} title="Recent" compact />}
        {upcoming_events.length > 0 && <EventTimeline events={upcoming_events} currentMet={clock.met_seconds} launchDate={mission.launch_date ?? undefined} title="Upcoming" />}
      </div>

      {/* Links */}
      <DashboardSection title="External Resources">
        <MissionLinksBar links={links} />
      </DashboardSection>

      {/* Updates + Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {latest_updates.length > 0 && (
          <DashboardSection title="Latest Updates" action={<Link to="/updates" className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors">View all →</Link>}>
            <div className="space-y-2">{latest_updates.slice(0, 4).map((u) => <UpdateCard key={u.id} update={u} />)}</div>
          </DashboardSection>
        )}
        {latest_media.length > 0 && (
          <DashboardSection title="Latest Media" action={<Link to="/media" className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors">View gallery →</Link>}>
            <div className="grid grid-cols-2 gap-2">
              {latest_media.slice(0, 4).map((asset) => (
                <div key={asset.nasa_id} className="aspect-video rounded-md overflow-hidden bg-space-slate/30 border border-subtle">
                  {asset.preview_url && <img src={asset.large_url || asset.preview_url} alt={asset.title} className="w-full h-full object-cover" loading="lazy" />}
                </div>
              ))}
            </div>
          </DashboardSection>
        )}
      </div>
    </div>
  );
}