package service

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/service/nasa"
	"github.com/onnwee/artemis/apps/api/internal/store"
	"github.com/rs/zerolog/log"
)

type ActiveService struct {
	missions *store.MissionStore
	blogs    *store.BlogUpdateStore
	media    *nasa.ImagesClient
	events   *store.EventStore
}

func NewActiveService(m *store.MissionStore, b *store.BlogUpdateStore, media *nasa.ImagesClient, events *store.EventStore) *ActiveService {
	return &ActiveService{missions: m, blogs: b, media: media, events: events}
}

func (s *ActiveService) GetDashboard(ctx context.Context) (*domain.ActiveMissionDashboard, error) {
	mission, err := s.missions.GetActiveMission(ctx)
	if err != nil {
		return nil, fmt.Errorf("get active mission: %w", err)
	}
	if mission == nil {
		return nil, nil
	}

	sections, err := s.missions.GetSections(ctx, mission.ID)
	if err != nil {
		return nil, fmt.Errorf("get sections: %w", err)
	}

	milestones, err := s.missions.GetMilestones(ctx, mission.ID)
	if err != nil {
		return nil, fmt.Errorf("get milestones: %w", err)
	}

	// Compute mission clock
	clock := buildMissionClock(mission)
	metSeconds := clock.MetSeconds

	// Compute trajectory
	earthKm, moonKm, velKmh := InterpolateTrajectory(metSeconds)
	phase, phaseLabel := PhaseFromMET(metSeconds)
	trajectory := domain.Trajectory{
		DistanceFromEarthKm: math.Round(earthKm*10) / 10,
		DistanceFromMoonKm:  math.Round(moonKm*10) / 10,
		VelocityKmh:         math.Round(velKmh*10) / 10,
		Phase:               phase,
		PhaseLabel:           phaseLabel,
	}

	// Compute section statuses dynamically from MET
	computeSectionStatuses(sections, metSeconds)

	var currentSection *domain.MissionSection
	for i := range sections {
		if sections[i].Status == "active" {
			currentSection = &sections[i]
			break
		}
	}

	var nextMilestone *domain.Milestone
	for i := range milestones {
		if milestones[i].CompletedAt == nil {
			nextMilestone = &milestones[i]
			break
		}
	}

	// Get events relative to current MET
	recentEvents, err := s.events.Recent(ctx, mission.ID, metSeconds, 5)
	if err != nil {
		log.Error().Err(err).Msg("failed to get recent events")
		recentEvents = []domain.MissionEvent{}
	}
	if recentEvents == nil {
		recentEvents = []domain.MissionEvent{}
	}

	upcomingEvents, err := s.events.Upcoming(ctx, mission.ID, metSeconds, 8)
	if err != nil {
		log.Error().Err(err).Msg("failed to get upcoming events")
		upcomingEvents = []domain.MissionEvent{}
	}
	if upcomingEvents == nil {
		upcomingEvents = []domain.MissionEvent{}
	}

	// Current event = most recent past event (first in recent list)
	var currentEvent *domain.MissionEvent
	if len(recentEvents) > 0 {
		evt := recentEvents[0]
		evt.Status = "active"
		currentEvent = &evt
	}

	// Next event = first upcoming
	var nextEvent *domain.MissionEvent
	if len(upcomingEvents) > 0 {
		nextEvent = &upcomingEvents[0]
	}

	// Get latest blog updates
	updates, err := s.blogs.ByMission(ctx, mission.ID, 5)
	if err != nil {
		log.Error().Err(err).Msg("failed to get blog updates for dashboard")
		updates = []domain.BlogUpdate{}
	}
	if updates == nil {
		updates = []domain.BlogUpdate{}
	}

	// Get latest media
	var mediaAssets []domain.MediaAsset
	result, err := s.media.Search(ctx, mission.Name, "image", 0, 0)
	if err != nil {
		log.Error().Err(err).Msg("failed to search media for dashboard")
	} else if len(result.Items) > 6 {
		mediaAssets = result.Items[:6]
	} else {
		mediaAssets = result.Items
	}
	if mediaAssets == nil {
		mediaAssets = []domain.MediaAsset{}
	}

	telemetry := buildTelemetry(mission, metSeconds, earthKm, moonKm, velKmh, phase)

	links := domain.MissionLinks{
		AROW:        "https://www.nasa.gov/missions/artemis-ii/arow/",
		DSN:         "https://eyes.nasa.gov/apps/dsn-now/dsn.html",
		NasaTV:      "https://www.nasa.gov/nasatv/",
		MissionPage: "https://www.nasa.gov/mission/artemis-ii/",
	}

	return &domain.ActiveMissionDashboard{
		Mission:        *mission,
		Clock:          clock,
		Trajectory:     trajectory,
		CurrentEvent:   currentEvent,
		NextEvent:      nextEvent,
		RecentEvents:   recentEvents,
		UpcomingEvents: upcomingEvents,
		CurrentSection: currentSection,
		NextMilestone:  nextMilestone,
		Sections:       sections,
		Telemetry:      telemetry,
		LatestUpdates:  updates,
		LatestMedia:    mediaAssets,
		Links:          links,
	}, nil
}

func (s *ActiveService) GetTelemetry(ctx context.Context) (*domain.TelemetrySnapshot, error) {
	mission, err := s.missions.GetActiveMission(ctx)
	if err != nil {
		return nil, err
	}
	if mission == nil {
		return nil, nil
	}
	metSeconds := computeMETSeconds(mission)
	earthKm, moonKm, velKmh := InterpolateTrajectory(metSeconds)
	phase, _ := PhaseFromMET(metSeconds)
	t := buildTelemetry(mission, metSeconds, earthKm, moonKm, velKmh, phase)
	return &t, nil
}

func (s *ActiveService) GetEvents(ctx context.Context, flightDay int) (*domain.EventsResponse, error) {
	mission, err := s.missions.GetActiveMission(ctx)
	if err != nil {
		return nil, err
	}
	if mission == nil {
		return nil, nil
	}

	metSeconds := computeMETSeconds(mission)
	var events []domain.MissionEvent

	if flightDay > 0 {
		events, err = s.events.ByFlightDay(ctx, mission.ID, flightDay)
	} else {
		events, err = s.events.List(ctx, mission.ID)
	}
	if err != nil {
		return nil, err
	}
	if events == nil {
		events = []domain.MissionEvent{}
	}

	// Set status based on current MET
	for i := range events {
		if events[i].MetSeconds <= metSeconds {
			events[i].Status = "completed"
		} else {
			events[i].Status = "upcoming"
		}
	}
	// Mark the most recent past event as active
	for i := len(events) - 1; i >= 0; i-- {
		if events[i].Status == "completed" {
			events[i].Status = "active"
			break
		}
	}

	return &domain.EventsResponse{
		Events:    events,
		Total:     len(events),
		FlightDay: flightDay,
	}, nil
}

func computeMETSeconds(mission *domain.Mission) int {
	if mission.LaunchDate == nil {
		return 0
	}
	dur := time.Since(*mission.LaunchDate)
	if dur < 0 {
		return 0
	}
	return int(dur.Seconds())
}

func buildMissionClock(mission *domain.Mission) domain.MissionClock {
	clock := domain.MissionClock{
		IsLive: true,
	}
	if mission.LaunchDate == nil {
		return clock
	}

	clock.LaunchTime = *mission.LaunchDate
	dur := time.Since(*mission.LaunchDate)
	if dur < 0 {
		clock.IsLive = false
		return clock
	}

	totalSeconds := int(dur.Seconds())
	clock.MetSeconds = totalSeconds
	clock.MetDisplay = formatMET(totalSeconds)

	// Flight day: FD01 = first 24h
	clock.FlightDay = (totalSeconds / 86400) + 1
	clock.FlightDayLabel = fmt.Sprintf("FD%02d", clock.FlightDay)
	clock.FlightDaySeconds = totalSeconds % 86400

	// Mission progress (0 to 1, based on ~9 day mission = ~718200 seconds to splashdown)
	missionDurationSeconds := 718200.0
	clock.MissionProgress = math.Min(float64(totalSeconds)/missionDurationSeconds, 1.0)

	return clock
}

func formatMET(totalSeconds int) string {
	days := totalSeconds / 86400
	remaining := totalSeconds % 86400
	hours := remaining / 3600
	remaining = remaining % 3600
	minutes := remaining / 60
	seconds := remaining % 60
	return fmt.Sprintf("%02d:%02d:%02d:%02d", days, hours, minutes, seconds)
}

// computeSectionStatuses sets each section's Status to "completed", "active",
// or "upcoming" based on the current MET and the section's day range.
// Exactly one section will be "active" — the highest-order section whose
// start day has been reached.
func computeSectionStatuses(sections []domain.MissionSection, metSeconds int) {
	currentFD := metSeconds/86400 + 1
	activeIdx := -1
	for i := range sections {
		startDay, _ := parseDayRange(sections[i].DayRange)
		if currentFD >= startDay {
			activeIdx = i
		}
	}
	for i := range sections {
		if i < activeIdx {
			sections[i].Status = "completed"
		} else if i == activeIdx {
			sections[i].Status = "active"
		} else {
			sections[i].Status = "upcoming"
		}
	}
}

// parseDayRange extracts start and end flight day numbers from strings like
// "Day 1", "Day 1-2", "Days 2-4", "Day 10".
func parseDayRange(dayRange string) (int, int) {
	s := strings.TrimPrefix(dayRange, "Days ")
	s = strings.TrimPrefix(s, "Day ")
	parts := strings.SplitN(s, "-", 2)
	start, _ := strconv.Atoi(strings.TrimSpace(parts[0]))
	if len(parts) == 2 {
		end, _ := strconv.Atoi(strings.TrimSpace(parts[1]))
		return start, end
	}
	return start, start
}

func buildTelemetry(mission *domain.Mission, metSeconds int, earthKm, moonKm, velKmh float64, phase string) domain.TelemetrySnapshot {
	elapsed := formatMET(metSeconds)

	return domain.TelemetrySnapshot{
		MissionID:         mission.ID,
		MissionElapsed:    elapsed,
		DistanceFromEarth: earthKm,
		DistanceFromMoon:  moonKm,
		Velocity:          velKmh,
		CurrentPhase:      phase,
		IsLive:            true,
		TrackerURL:        "https://www.nasa.gov/missions/artemis-ii/arow/",
		UpdatedAt:         time.Now(),
	}
}
