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
import { useLiveQuery } from "@/hooks/useQuery";
import { getActiveDashboard } from "@/api/active";

export function ActivePage() {
  const { data: dashboard, loading, error } = useLiveQuery(
    getActiveDashboard,
    30_000, // refresh every 30 seconds
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboard)
    return (
      <div className="text-center py-20 text-lunar-white/50">
        No active mission
      </div>
    );

  const {
    mission,
    clock,
    trajectory,
    current_event,
    next_event,
    recent_events,
    upcoming_events,
    current_section,
    next_milestone,
    sections,
    latest_updates,
    latest_media,
    links,
  } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{mission.name}</h1>
            <StatusBadge status={mission.status} />
          </div>
          <p className="text-lunar-white/45 mt-1">{mission.tagline}</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-active" />
          </span>
          <span className="text-sm text-status-active font-medium">LIVE</span>
        </div>
      </div>

      {/* Mission Clock */}
      <MissionClockDisplay clock={clock} />

      {/* Trajectory Visualization */}
      <TrajectoryMap
        trajectory={trajectory}
        missionProgress={clock.mission_progress}
      />

      {/* Current & Next Event */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current_event && (
          <CurrentEventCard
            event={current_event}
            label="Current Activity"
            accent="green"
          />
        )}
        {next_event && (
          <CurrentEventCard
            event={next_event}
            label="Coming Up"
            accent="blue"
          />
        )}
      </div>

      {/* Current Phase & Next Milestone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current_section && (
          <div className="glass-card glass-card-active p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-status-active animate-pulse" />
              <span className="text-xs font-medium text-lunar-white/50 uppercase tracking-wider">
                Current Phase
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg">{current_section.name}</h3>
            <p className="text-sm text-lunar-white/45 mt-1">
              {current_section.description}
            </p>
            <span className="text-xs text-lunar-white/30 mt-2 block">
              {current_section.day_range}
            </span>
          </div>
        )}

        {next_milestone && (
          <div className="glass-card p-4" style={{ borderColor: "rgba(59, 130, 246, 0.2)" }}>
            <span className="text-xs font-medium text-lunar-white/50 uppercase tracking-wider">
              Next Milestone
            </span>
            <h3 className="font-display font-semibold text-lg mt-2">
              {next_milestone.title}
            </h3>
            <p className="text-sm text-lunar-white/45 mt-1">
              {next_milestone.description}
            </p>
            {next_milestone.planned_at && (
              <p className="text-xs text-artemis-blue mt-2">
                Planned:{" "}
                {new Date(next_milestone.planned_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Timeline: Upcoming & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection
          title="Upcoming Events"
          action={
            <Link
              to="/schedule"
              className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors"
            >
              Full schedule →
            </Link>
          }
        >
          <EventTimeline
            events={upcoming_events}
            currentMet={clock.met_seconds}
          />
        </DashboardSection>

        <DashboardSection title="Recent Events">
          <EventTimeline
            events={recent_events}
            currentMet={clock.met_seconds}
            compact
          />
        </DashboardSection>
      </div>

      {/* Mission Timeline Progress */}
      {sections.length > 0 && (
        <DashboardSection title="Mission Phases">
          <div className="space-y-2">
            {sections.map((sec) => {
              const isActive = sec.status === "active";
              const isCompleted = sec.status === "completed";
              return (
                <div
                  key={sec.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-status-active/8 border border-status-active/15 shadow-[0_0_12px_rgba(34,197,94,0.04)]"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-status-active" />
                      </span>
                    ) : isCompleted ? (
                      <svg
                        className="w-3 h-3 text-status-completed"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="flex h-3 w-3 rounded-full border border-white/10" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted ? "text-lunar-white/40" : ""
                      }`}
                    >
                      {sec.name}
                    </p>
                  </div>
                  <span className="text-xs text-lunar-white/30">
                    {sec.day_range}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex gap-1">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    sec.status === "completed"
                      ? "bg-status-completed/60"
                      : sec.status === "active"
                        ? "bg-gradient-to-r from-status-active to-artemis-cyan animate-pulse"
                        : "bg-white/[0.04]"
                  }`}
                  title={sec.name}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-lunar-white/25">
              <span>Launch</span>
              <span>Splashdown</span>
            </div>
          </div>
        </DashboardSection>
      )}

      {/* External Links */}
      <DashboardSection title="Live Tracking & Coverage">
        <MissionLinksBar links={links} />
      </DashboardSection>

      {/* Latest Updates */}
      {latest_updates.length > 0 && (
        <DashboardSection
          title="Latest Updates"
          action={
            <Link
              to="/updates"
              className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors"
            >
              View all →
            </Link>
          }
        >
          <div className="space-y-3">
            {latest_updates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Latest Media */}
      {latest_media.length > 0 && (
        <DashboardSection
          title="Latest Media"
          action={
            <Link
              to="/media"
              className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors"
            >
              View gallery →
            </Link>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {latest_media.map((asset) => (
              <div
                key={asset.nasa_id}
                className="aspect-video rounded-xl overflow-hidden bg-space-gray/30 border border-white/[0.04]"
              >
                {asset.preview_url && (
                  <img
                    src={asset.preview_url}
                    alt={asset.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}
