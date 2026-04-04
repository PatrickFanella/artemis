package service

import (
	"context"

	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/store"
)

type UpdateService struct {
	store *store.BlogUpdateStore
}

func NewUpdateService(s *store.BlogUpdateStore) *UpdateService {
	return &UpdateService{store: s}
}

func (s *UpdateService) List(ctx context.Context, source string, limit, offset int) ([]domain.BlogUpdate, error) {
	if limit <= 0 {
		limit = 20
	}
	return s.store.List(ctx, source, limit, offset)
}

func (s *UpdateService) Latest(ctx context.Context) ([]domain.BlogUpdate, error) {
	return s.store.Latest(ctx, 10)
}

func (s *UpdateService) ByMission(ctx context.Context, missionID string, limit int) ([]domain.BlogUpdate, error) {
	if limit <= 0 {
		limit = 20
	}
	return s.store.ByMission(ctx, missionID, limit)
}
