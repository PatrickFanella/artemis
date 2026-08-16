import { api } from "./client";
import type { Mission, MissionSection, Milestone, EventsResponse } from "@/lib/types";

export function getMissions() {
  return api<Mission[]>("/api/v1/missions");
}

export function getMission(id: string) {
  return api<Mission>(`/api/v1/missions/${id}`);
}

export function getActiveMission() {
  return api<Mission>("/api/v1/missions/active");
}

export function getMissionSections(id: string) {
  return api<MissionSection[]>(`/api/v1/missions/${id}/sections`);
}

export function getMilestones(id: string) {
  return api<Milestone[]>(`/api/v1/missions/${id}/milestones`);
}

export function getMissionEvents(id: string, fd?: number) {
  const params = fd ? `?fd=${fd}` : "";
  return api<EventsResponse>(`/api/v1/missions/${id}/events${params}`);
}
