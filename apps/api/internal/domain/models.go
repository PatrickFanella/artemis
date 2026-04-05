package domain

import "time"

type Mission struct {
	ID          string       `json:"id"`
	Name        string       `json:"name"`
	Tagline     string       `json:"tagline"`
	Description string       `json:"description"`
	Status      string       `json:"status"` // "active" | "upcoming" | "completed"
	LaunchDate  *time.Time   `json:"launch_date,omitempty"`
	Duration    string       `json:"duration"`
	CrewJSON    string       `json:"-"`
	Crew        []CrewMember `json:"crew"`
	ImageURL    string       `json:"image_url"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

type CrewMember struct {
	Name  string `json:"name"`
	Role  string `json:"role"`
	Bio   string `json:"bio"`
	Image string `json:"image"`
}

type MissionSection struct {
	ID          string `json:"id"`
	MissionID   string `json:"mission_id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Order       int    `json:"order"`
	DayRange    string `json:"day_range"`
	Status      string `json:"status"` // "completed" | "active" | "upcoming"
}

type Milestone struct {
	ID          string     `json:"id"`
	MissionID   string     `json:"mission_id"`
	SectionID   string     `json:"section_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	PlannedAt   *time.Time `json:"planned_at,omitempty"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	Order       int        `json:"order"`
}

type BlogUpdate struct {
	ID          string    `json:"id"`
	MissionID   string    `json:"mission_id,omitempty"`
	Source      string    `json:"source"`
	Title       string    `json:"title"`
	URL         string    `json:"url"`
	Author      string    `json:"author"`
	Summary     string    `json:"summary"`
	ImageURL    string    `json:"image_url,omitempty"`
	PublishedAt time.Time `json:"published_at"`
	CreatedAt   time.Time `json:"created_at"`
}

type MediaAsset struct {
	NasaID       string   `json:"nasa_id"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	MediaType    string   `json:"media_type"`
	DateCreated  string   `json:"date_created"`
	Center       string   `json:"center"`
	Photographer string   `json:"photographer,omitempty"`
	Keywords     []string `json:"keywords"`
	PreviewURL   string   `json:"preview_url"`
}

type MediaSearchResult struct {
	Items     []MediaAsset `json:"items"`
	TotalHits int          `json:"total_hits"`
}

type TelemetrySnapshot struct {
	MissionID         string    `json:"mission_id"`
	MissionElapsed    string    `json:"mission_elapsed"`
	DistanceFromEarth float64   `json:"distance_from_earth"`
	DistanceFromMoon  float64   `json:"distance_from_moon"`
	Velocity          float64   `json:"velocity"`
	CurrentPhase      string    `json:"current_phase"`
	IsLive            bool      `json:"is_live"`
	TrackerURL        string    `json:"tracker_url"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// MissionEvent represents a single scheduled activity in the mission timeline
type MissionEvent struct {
	ID              string `json:"id"`
	MissionID       string `json:"mission_id"`
	MetSeconds      int    `json:"met_seconds"`
	DurationSeconds int    `json:"duration_seconds,omitempty"`
	FlightDay       int    `json:"flight_day"`
	Category        string `json:"category"` // propulsion, navigation, crew, communication, system, science
	Title           string `json:"title"`
	Description     string `json:"description"`
	Status          string `json:"status"` // completed, active, upcoming (computed)
}

// MissionClock represents the live mission timer
type MissionClock struct {
	LaunchTime      time.Time `json:"launch_time"`
	MetSeconds      int       `json:"met_seconds"`
	MetDisplay      string    `json:"met_display"`       // "DD:HH:MM:SS"
	FlightDay       int       `json:"flight_day"`
	FlightDayLabel  string    `json:"flight_day_label"`  // "FD04"
	FlightDaySeconds int      `json:"flight_day_seconds"` // seconds into current FD
	MissionProgress float64   `json:"mission_progress"`  // 0.0 to 1.0
	IsLive          bool      `json:"is_live"`
}

// Trajectory represents computed spacecraft position and velocity
type Trajectory struct {
	DistanceFromEarthKm float64 `json:"distance_from_earth_km"`
	DistanceFromMoonKm  float64 `json:"distance_from_moon_km"`
	VelocityKmh         float64 `json:"velocity_kmh"`
	Phase               string  `json:"phase"`
	PhaseLabel          string  `json:"phase_label"`
}

// MissionLinks contains external tracking and coverage URLs
type MissionLinks struct {
	AROW         string `json:"arow"`
	DSN          string `json:"dsn"`
	NasaTV       string `json:"nasa_tv"`
	MissionPage  string `json:"mission_page"`
}

type ActiveMissionDashboard struct {
	Mission        Mission            `json:"mission"`
	Clock          MissionClock       `json:"clock"`
	Trajectory     Trajectory         `json:"trajectory"`
	CurrentEvent   *MissionEvent      `json:"current_event"`
	NextEvent      *MissionEvent      `json:"next_event"`
	RecentEvents   []MissionEvent     `json:"recent_events"`
	UpcomingEvents []MissionEvent     `json:"upcoming_events"`
	CurrentSection *MissionSection    `json:"current_section"`
	NextMilestone  *Milestone         `json:"next_milestone"`
	Sections       []MissionSection   `json:"sections"`
	Telemetry      TelemetrySnapshot  `json:"telemetry"`
	LatestUpdates  []BlogUpdate       `json:"latest_updates"`
	LatestMedia    []MediaAsset       `json:"latest_media"`
	Links          MissionLinks       `json:"links"`
}

// EventsResponse is the response for the events list endpoint
type EventsResponse struct {
	Events   []MissionEvent `json:"events"`
	Total    int            `json:"total"`
	FlightDay int           `json:"flight_day,omitempty"`
}
