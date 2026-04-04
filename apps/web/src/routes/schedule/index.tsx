import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { EventTimeline } from "@/components/EventTimeline";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useQuery, useLiveQuery } from "@/hooks/useQuery";
import {
  getActiveMission,
  getMissionSections,
  getMilestones,
} from "@/api/missions";
import { getActiveEvents } from "@/api/active";
import type { MissionEvent } from "@/lib/types";

const FLIGHT_DAYS = Array.from({ length: 9 }, (_, i) => i + 1);

const FD_LABELS: Record<number, string> = {
  1: "Launch & Prox Ops",
  2: "TLI & Outbound",
  3: "Outbound Coast",
  4: "Approaching Moon",
  5: "Lunar Flyby",
  6: "Return Coast",
  7: "Homeward Bound",
  8: "Entry Prep",
  9: "Reentry & Splashdown",
};

function computeCurrentMET(launchDate: string | null): number {
  if (!launchDate) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(launchDate).getTime()) / 1000));
}

export function SchedulePage() {
  const { data: mission, loading: mLoading } = useQuery(getActiveMission);
  const [selectedFD, setSelectedFD] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"events" | "phases">("events");

  const missionId = mission?.id ?? "";
  const { data: sections, loading: sLoading } = useQuery(
    () => (missionId ? getMissionSections(missionId) : Promise.resolve([])),
    [missionId],
  );
  const { data: milestones, loading: msLoading } = useQuery(
    () => (missionId ? getMilestones(missionId) : Promise.resolve([])),
    [missionId],
  );

  // Load events — all or filtered by flight day
  const { data: eventsData, loading: eLoading } = useLiveQuery(
    () => getActiveEvents(selectedFD ?? undefined),
    60_000,
    [selectedFD],
  );

  // Compute current MET for the schedule display
  const [currentMET, setCurrentMET] = useState(() =>
    computeCurrentMET(mission?.launch_date ?? null),
  );

  useEffect(() => {
    if (!mission?.launch_date) return;
    setCurrentMET(computeCurrentMET(mission.launch_date));
    const id = setInterval(
      () => setCurrentMET(computeCurrentMET(mission.launch_date!)),
      10_000,
    );
    return () => clearInterval(id);
  }, [mission?.launch_date]);

  // Auto-select current flight day on load
  useEffect(() => {
    if (mission?.launch_date && selectedFD === null) {
      const met = computeCurrentMET(mission.launch_date);
      const fd = Math.floor(met / 86400) + 1;
      setSelectedFD(Math.min(fd, 9));
    }
  }, [mission?.launch_date, selectedFD]);

  // Split events into groups for display
  const eventsByStatus = useMemo(() => {
    if (!eventsData?.events) return { completed: [], active: null as MissionEvent | null, upcoming: [] as MissionEvent[] };
    const events = eventsData.events;
    const completed = events.filter((e) => e.status === "completed");
    const active = events.find((e) => e.status === "active") || null;
    const upcoming = events.filter((e) => e.status === "upcoming");
    return { completed, active, upcoming };
  }, [eventsData]);

  const loading = mLoading || sLoading || msLoading;

  if (loading) return <LoadingSpinner />;
  if (!mission) return <ErrorMessage message="No active mission found" />;

  return (
    <div>
      <PageHeader
        title={`${mission.name} Schedule`}
        subtitle={`Mission timeline — ${mission.duration}`}
      />

      {/* View mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setViewMode("events")}
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            viewMode === "events"
              ? "bg-artemis-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]"
              : "glass-card text-lunar-white/60 hover:text-lunar-white"
          }`}
        >
          Detailed Events
        </button>
        <button
          onClick={() => setViewMode("phases")}
          className={`px-4 py-2 text-sm rounded-lg transition-all ${
            viewMode === "phases"
              ? "bg-artemis-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]"
              : "glass-card text-lunar-white/60 hover:text-lunar-white"
          }`}
        >
          Mission Phases
        </button>
      </div>

      {viewMode === "events" ? (
        <div>
          {/* Flight Day tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {FLIGHT_DAYS.map((fd) => {
              const currentFD = Math.floor(currentMET / 86400) + 1;
              const isCurrent = fd === currentFD;
              const isPast = fd < currentFD;
              const isSelected = fd === selectedFD;

              return (
                <button
                  key={fd}
                  onClick={() => setSelectedFD(fd)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all border ${
                    isSelected
                      ? "bg-artemis-blue text-white border-artemis-blue shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                      : isCurrent
                        ? "bg-status-active/8 text-status-active border-status-active/20 hover:bg-status-active/15"
                        : isPast
                          ? "glass-card text-lunar-white/40 hover:text-lunar-white/60"
                          : "glass-card text-lunar-white/60 hover:text-lunar-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isCurrent && !isSelected && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-active" />
                      </span>
                    )}
                    <span className="font-medium">FD{fd.toString().padStart(2, "0")}</span>
                  </div>
                  <p className="text-xs opacity-60 mt-0.5 whitespace-nowrap">
                    {FD_LABELS[fd] || `Day ${fd}`}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Event count & status */}
          {eventsData && (
            <div className="flex items-center gap-4 mb-4 text-sm text-lunar-white/45">
              <span>{eventsData.total} events</span>
              {selectedFD && (
                <>
                  <span>·</span>
                  <span>{eventsByStatus.completed.length} completed</span>
                  <span>·</span>
                  <span>{eventsByStatus.upcoming.length} upcoming</span>
                </>
              )}
            </div>
          )}

          {/* Events list */}
          {eLoading && !eventsData ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-6">
              {eventsByStatus.active && (
                <div className="glass-card glass-card-active p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-status-active" />
                    </span>
                    <span className="text-xs font-medium text-status-active uppercase tracking-wider">
                      Current
                    </span>
                  </div>
                  <EventTimeline
                    events={[eventsByStatus.active]}
                    currentMet={currentMET}
                    launchDate={mission.launch_date ?? undefined}
                  />
                </div>
              )}

              {eventsByStatus.upcoming.length > 0 && (
                <EventTimeline
                  events={eventsByStatus.upcoming}
                  currentMet={currentMET}
                  launchDate={mission.launch_date ?? undefined}
                  title="Upcoming"
                />
              )}

              {eventsByStatus.completed.length > 0 && (
                <EventTimeline
                  events={[...eventsByStatus.completed].reverse()}
                  currentMet={currentMET}
                  launchDate={mission.launch_date ?? undefined}
                  title="Completed"
                  compact
                />
              )}
            </div>
          )}
        </div>
      ) : (
        /* Phases view — original timeline */
        <Timeline sections={sections ?? []} milestones={milestones ?? []} />
      )}
    </div>
  );
}
