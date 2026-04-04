package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/onnwee/artemis/apps/api/internal/http/handlers"
	"github.com/onnwee/artemis/apps/api/internal/http/middleware"
	"github.com/onnwee/artemis/apps/api/internal/service"
	"github.com/onnwee/artemis/apps/api/internal/service/nasa"
)

type Services struct {
	Mission *service.MissionService
	Update  *service.UpdateService
	Active  *service.ActiveService
}

func New(svc Services) http.Handler {
	r := chi.NewRouter()

	r.Use(chimw.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.CORS)
	r.Use(chimw.Recoverer)

	r.Get("/healthz", handlers.Health)

	mh := handlers.NewMissionHandler(svc.Mission)
	uh := handlers.NewUpdateHandler(svc.Update)
	mdh := handlers.NewMediaHandler(nasa.NewImagesClient())
	ah := handlers.NewActiveHandler(svc.Active)

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/missions", mh.ListMissions)
		r.Get("/missions/active", mh.GetActiveMission)
		r.Get("/missions/{id}", mh.GetMission)
		r.Get("/missions/{id}/sections", mh.GetSections)
		r.Get("/missions/{id}/milestones", mh.GetMilestones)

		r.Get("/updates", uh.List)
		r.Get("/updates/latest", uh.Latest)
		r.Get("/missions/{id}/updates", uh.ByMission)

		r.Get("/media", mdh.Search)

		r.Get("/active", ah.GetDashboard)
		r.Get("/active/telemetry", ah.GetTelemetry)
		r.Get("/active/events", ah.GetEvents)
	})

	return r
}
