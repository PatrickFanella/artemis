export interface CrewMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Mission {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: "active" | "upcoming" | "completed";
  launch_date: string | null;
  duration: string;
  crew: CrewMember[];
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface MissionSection {
  id: string;
  mission_id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  day_range: string;
  status: "completed" | "active" | "upcoming";
}

export interface Milestone {
  id: string;
  mission_id: string;
  section_id: string;
  title: string;
  description: string;
  planned_at: string | null;
  completed_at: string | null;
  order: number;
}

export interface BlogUpdate {
  id: string;
  mission_id: string;
  source: string;
  title: string;
  url: string;
  author: string;
  summary: string;
  image_url: string;
  published_at: string;
  created_at: string;
}

export interface MediaAsset {
  nasa_id: string;
  title: string;
  description: string;
  media_type: string;
  date_created: string;
  center: string;
  photographer?: string;
  keywords: string[];
  preview_url: string;
}

export interface MediaSearchResult {
  items: MediaAsset[];
  total_hits: number;
}

export interface TelemetrySnapshot {
  mission_id: string;
  mission_elapsed: string;
  distance_from_earth: number;
  distance_from_moon: number;
  velocity: number;
  current_phase: string;
  is_live: boolean;
  tracker_url: string;
  updated_at: string;
}

export interface MissionEvent {
  id: string;
  mission_id: string;
  met_seconds: number;
  flight_day: number;
  category: "propulsion" | "navigation" | "crew" | "communication" | "system" | "science";
  title: string;
  description: string;
  status: "completed" | "active" | "upcoming";
}

export interface MissionClock {
  launch_time: string;
  met_seconds: number;
  met_display: string;
  flight_day: number;
  flight_day_label: string;
  flight_day_seconds: number;
  mission_progress: number;
  is_live: boolean;
}

export interface Trajectory {
  distance_from_earth_km: number;
  distance_from_moon_km: number;
  velocity_kmh: number;
  phase: string;
  phase_label: string;
}

export interface MissionLinks {
  arow: string;
  dsn: string;
  nasa_tv: string;
  mission_page: string;
}

export interface ActiveMissionDashboard {
  mission: Mission;
  clock: MissionClock;
  trajectory: Trajectory;
  current_event: MissionEvent | null;
  next_event: MissionEvent | null;
  recent_events: MissionEvent[];
  upcoming_events: MissionEvent[];
  current_section: MissionSection | null;
  next_milestone: Milestone | null;
  sections: MissionSection[];
  telemetry: TelemetrySnapshot;
  latest_updates: BlogUpdate[];
  latest_media: MediaAsset[];
  links: MissionLinks;
}

export interface EventsResponse {
  events: MissionEvent[];
  total: number;
  flight_day?: number;
}
