package service

import (
	"context"

	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/store"
)

type MissionService struct {
	store  *store.MissionStore
	events *store.EventStore
}

func NewMissionService(s *store.MissionStore, e *store.EventStore) *MissionService {
	return &MissionService{store: s, events: e}
}

func (s *MissionService) ListMissions(ctx context.Context) ([]domain.Mission, error) {
	return s.store.ListMissions(ctx)
}

func (s *MissionService) GetMission(ctx context.Context, id string) (*domain.Mission, error) {
	return s.store.GetMission(ctx, id)
}

func (s *MissionService) GetActiveMission(ctx context.Context) (*domain.Mission, error) {
	return s.store.GetActiveMission(ctx)
}

func (s *MissionService) GetSections(ctx context.Context, missionID string) ([]domain.MissionSection, error) {
	return s.store.GetSections(ctx, missionID)
}

func (s *MissionService) GetMilestones(ctx context.Context, missionID string) ([]domain.Milestone, error) {
	return s.store.GetMilestones(ctx, missionID)
}

func (s *MissionService) GetEvents(ctx context.Context, missionID string, flightDay int) (*domain.EventsResponse, error) {
	mission, err := s.store.GetMission(ctx, missionID)
	if err != nil {
		return nil, err
	}
	if mission == nil {
		return nil, nil
	}

	var events []domain.MissionEvent
	if flightDay > 0 {
		events, err = s.events.ByFlightDay(ctx, missionID, flightDay)
	} else {
		events, err = s.events.List(ctx, missionID)
	}
	if err != nil {
		return nil, err
	}
	if events == nil {
		events = []domain.MissionEvent{}
	}

	metSeconds := computeMETSeconds(mission)
	for i := range events {
		endMet := events[i].MetSeconds + events[i].DurationSeconds
		if events[i].DurationSeconds > 0 && metSeconds >= events[i].MetSeconds && metSeconds < endMet {
			events[i].Status = "active"
		} else if events[i].MetSeconds <= metSeconds {
			events[i].Status = "completed"
		} else {
			events[i].Status = "upcoming"
		}
	}

	return &domain.EventsResponse{
		Events:    events,
		Total:     len(events),
		FlightDay: flightDay,
	}, nil
}
