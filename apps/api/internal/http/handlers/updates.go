package handlers

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/service"
)

type UpdateHandler struct {
	svc *service.UpdateService
}

func NewUpdateHandler(svc *service.UpdateService) *UpdateHandler {
	return &UpdateHandler{svc: svc}
}

func (h *UpdateHandler) List(w http.ResponseWriter, r *http.Request) {
	source := r.URL.Query().Get("source")
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))

	updates, err := h.svc.List(r.Context(), source, limit, offset)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list updates")
		return
	}
	if updates == nil {
		updates = []domain.BlogUpdate{}
	}
	writeJSON(w, http.StatusOK, updates)
}

func (h *UpdateHandler) Latest(w http.ResponseWriter, r *http.Request) {
	updates, err := h.svc.Latest(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get latest updates")
		return
	}
	if updates == nil {
		updates = []domain.BlogUpdate{}
	}
	writeJSON(w, http.StatusOK, updates)
}

func (h *UpdateHandler) ByMission(w http.ResponseWriter, r *http.Request) {
	missionID := chi.URLParam(r, "id")
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	updates, err := h.svc.ByMission(r.Context(), missionID, limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get mission updates")
		return
	}
	if updates == nil {
		updates = []domain.BlogUpdate{}
	}
	writeJSON(w, http.StatusOK, updates)
}
