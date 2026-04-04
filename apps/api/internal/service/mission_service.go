package service

import (
	"context"

	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/store"
)

type MissionService struct {
	store *store.MissionStore
}

func NewMissionService(s *store.MissionStore) *MissionService {
	return &MissionService{store: s}
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
