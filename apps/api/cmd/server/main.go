package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/onnwee/artemis/apps/api/internal/config"
	"github.com/onnwee/artemis/apps/api/internal/http/router"
	"github.com/onnwee/artemis/apps/api/internal/jobs"
	"github.com/onnwee/artemis/apps/api/internal/service"
	"github.com/onnwee/artemis/apps/api/internal/service/nasa"
	"github.com/onnwee/artemis/apps/api/internal/store"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	cfg := config.Load()

	zerolog.SetGlobalLevel(cfg.LogLevel)
	if cfg.LogLevel == zerolog.DebugLevel {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	}

	db, err := store.New(cfg.DBPath)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to open database")
	}
	defer db.Close()

	missionStore := store.NewMissionStore(db)
	blogStore := store.NewBlogUpdateStore(db)
	eventStore := store.NewEventStore(db)

	nasaClient := nasa.NewImagesClient()

	missionSvc := service.NewMissionService(missionStore)
	updateSvc := service.NewUpdateService(blogStore)
	activeSvc := service.NewActiveService(missionStore, blogStore, nasaClient, eventStore)

	// Start RSS ingestion in background
	ingester := jobs.NewRSSIngester(blogStore)
	scheduler := jobs.NewScheduler(ingester, 15*time.Minute)
	ctx, stopScheduler := context.WithCancel(context.Background())
	go scheduler.Start(ctx)

	r := router.New(router.Services{
		Mission: missionSvc,
		Update:  updateSvc,
		Active:  activeSvc,
	})

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Info().Int("port", cfg.Port).Msg("starting server")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("server failed")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info().Msg("shutting down server")
	stopScheduler()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal().Err(err).Msg("server forced shutdown")
	}
}
