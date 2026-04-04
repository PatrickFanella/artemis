import { api } from "./client";
import type { ActiveMissionDashboard, TelemetrySnapshot, EventsResponse } from "@/lib/types";

export function getActiveDashboard() {
  return api<ActiveMissionDashboard>("/api/v1/active");
}

export function getActiveTelemetry() {
  return api<TelemetrySnapshot>("/api/v1/active/telemetry");
}

export function getActiveEvents(fd?: number) {
  const params = fd ? `?fd=${fd}` : "";
  return api<EventsResponse>(`/api/v1/active/events${params}`);
}
