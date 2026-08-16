import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { EventTimeline } from "@/components/EventTimeline";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { SSR_KEYS } from "@/lib/ssrKeys";
import { getMissions, getMissionSections, getMilestones, getMissionEvents } from "@/api/missions";
import type { Mission, MissionEvent } from "@/lib/types";

const FD_LABELS: Record<number, string> = { 1: "Launch", 2: "Orbit & TLI", 3: "Outbound Coast", 4: "Approach", 5: "Flyby", 6: "Return Coast", 7: "Return Coast", 8: "Entry Prep", 9: "Reentry", 10: "Splashdown" };

function computeCurrentMET(launchDate: string | null): number {
  if (!launchDate) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(launchDate).getTime()) / 1000));
}

export function SchedulePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: missions, loading: mLoading } = useQuery(getMissions, [], SSR_KEYS.missions);
  const [selectedFD, setSelectedFD] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"events" | "phases">("events");

  const mission = useMemo<Mission | null>(() => {
    if (!missions) return null;
    const requested = searchParams.get("mission");
    if (requested) {
      return missions.find((m) => m.id === requested) ?? null;
    }
    const active = missions.find((m) => m.status === "active");
    if (active) return active;
    return missions.filter((m) => m.status !== "upcoming" && m.launch_date).sort((a, b) => new Date(b.launch_date!).getTime() - new Date(a.launch_date!).getTime())[0] ?? null;
  }, [missions, searchParams]);

  const missionId = mission?.id ?? "";
  const { data: sections, loading: sLoading } = useQuery(() => missionId ? getMissionSections(missionId) : Promise.resolve([]), [missionId], SSR_KEYS.sections(missionId));
  const { data: milestones, loading: msLoading } = useQuery(() => missionId ? getMilestones(missionId) : Promise.resolve([]), [missionId], SSR_KEYS.milestones(missionId));
  const { data: eventsData, loading: eLoading } = useQuery(() => missionId ? getMissionEvents(missionId, selectedFD ?? undefined) : Promise.resolve({ events: [], total: 0 }), [missionId, selectedFD], SSR_KEYS.events(missionId, selectedFD ?? undefined));

  const [currentMET, setCurrentMET] = useState(() => computeCurrentMET(mission?.launch_date ?? null));
  useEffect(() => {
    if (!mission?.launch_date) return;
    setCurrentMET(computeCurrentMET(mission.launch_date));
    const id = setInterval(() => setCurrentMET(computeCurrentMET(mission.launch_date!)), 10_000);
    return () => clearInterval(id);
  }, [mission?.launch_date]);

  const flightDays = useMemo(() => {
    const max = eventsData?.events.reduce((acc, e) => Math.max(acc, e.flight_day), 0) ?? 10;
    return Array.from({ length: Math.max(max, 10) }, (_, i) => i + 1);
  }, [eventsData]);

  useEffect(() => {
    if (mission?.launch_date && selectedFD === null) {
      const met = computeCurrentMET(mission.launch_date);
      setSelectedFD(Math.min(Math.floor(met / 86400) + 1, 10));
    }
  }, [mission?.launch_date, selectedFD]);

  const eventsByStatus = useMemo(() => {
    if (!eventsData?.events) return { completed: [], active: null as MissionEvent | null, upcoming: [] as MissionEvent[] };
    return {
      completed: eventsData.events.filter((e: MissionEvent) => e.status === "completed"),
      active: eventsData.events.find((e: MissionEvent) => e.status === "active") || null,
      upcoming: eventsData.events.filter((e: MissionEvent) => e.status === "upcoming"),
    };
  }, [eventsData]);

  const loading = mLoading || sLoading || msLoading;
  if (loading) return <LoadingSpinner />;
  if (!mission) return <ErrorMessage message="No mission schedule available" />;

  return (
    <div>
      <SeoHead title={`${mission.name} Schedule`} description={`Day-by-day timeline for ${mission.name}.`} canonicalPath="/schedule" />
      <PageHeader title={`${mission.name} Schedule`} subtitle={`Mission timeline - ${mission.duration}`} />

      {/* Mission selector */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {missions?.map((m) => (
          <button
            key={m.id}
            onClick={() => { setSearchParams({ mission: m.id }); setSelectedFD(null); }}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${m.id === missionId ? "bg-artemis-blue text-white" : "panel panel-hover text-secondary"}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* View mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setViewMode("events")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${viewMode === "events" ? "bg-artemis-blue text-white" : "panel panel-hover text-secondary"}`}>Detailed Events</button>
        <button onClick={() => setViewMode("phases")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${viewMode === "phases" ? "bg-artemis-blue text-white" : "panel panel-hover text-secondary"}`}>Mission Phases</button>
      </div>

      {viewMode === "events" ? (
        <div>
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {flightDays.map((fd) => {
              const currentFD = Math.floor(currentMET / 86400) + 1;
              const isCurrent = fd === currentFD, isPast = fd < currentFD, isSelected = fd === selectedFD;
              return (
                <button key={fd} onClick={() => setSelectedFD(fd)}
                  className={`shrink-0 px-3 py-2 rounded-md text-sm transition-colors border ${isSelected ? "bg-artemis-blue text-white border-artemis-blue" : isCurrent ? "bg-status-active/8 text-status-active border-status-active/20" : isPast ? "panel text-faint" : "panel text-secondary"}`}>
                  <span className="font-medium">FD{fd.toString().padStart(2, "0")}</span>
                  <p className="text-xs opacity-60 mt-0.5 whitespace-nowrap">{FD_LABELS[fd] || `Day ${fd}`}</p>
                </button>
              );
            })}
          </div>

          {eventsData && <div className="flex items-center gap-4 mb-4 text-sm text-muted"><span>{eventsData.total} events</span>{selectedFD && <><span>·</span><span>{eventsByStatus.completed.length} completed</span><span>·</span><span>{eventsByStatus.upcoming.length} upcoming</span></>}</div>}

          {eLoading && !eventsData ? <LoadingSpinner /> : (
            <div className="space-y-6">
              {eventsByStatus.active && (
                <div className="panel panel-highlight p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-status-active" /></span>
                    <span className="label text-status-active">Current</span>
                  </div>
                  <EventTimeline events={[eventsByStatus.active]} currentMet={currentMET} launchDate={mission.launch_date ?? undefined} />
                </div>
              )}
              {eventsByStatus.upcoming.length > 0 && <EventTimeline events={eventsByStatus.upcoming} currentMet={currentMET} launchDate={mission.launch_date ?? undefined} title="Upcoming" />}
              {eventsByStatus.completed.length > 0 && <EventTimeline events={[...eventsByStatus.completed].reverse()} currentMet={currentMET} launchDate={mission.launch_date ?? undefined} title="Completed" compact />}
            </div>
          )}
        </div>
      ) : (
        <Timeline sections={sections ?? []} milestones={milestones ?? []} />
      )}
    </div>
  );
}