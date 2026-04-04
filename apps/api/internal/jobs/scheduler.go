package jobs

import (
	"context"
	"time"

	"github.com/rs/zerolog/log"
)

type Scheduler struct {
	ingester *RSSIngester
	interval time.Duration
}

func NewScheduler(ingester *RSSIngester, interval time.Duration) *Scheduler {
	return &Scheduler{
		ingester: ingester,
		interval: interval,
	}
}

func (s *Scheduler) Start(ctx context.Context) {
	// Run once immediately
	log.Info().Msg("running initial RSS ingestion")
	s.ingester.Run(ctx)

	ticker := time.NewTicker(s.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Info().Msg("scheduler stopped")
			return
		case <-ticker.C:
			log.Info().Msg("running scheduled RSS ingestion")
			s.ingester.Run(ctx)
		}
	}
}
