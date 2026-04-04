package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/service"
)

type MissionHandler struct {
	svc *service.MissionService
}

func NewMissionHandler(svc *service.MissionService) *MissionHandler {
	return &MissionHandler{svc: svc}
}

func (h *MissionHandler) ListMissions(w http.ResponseWriter, r *http.Request) {
	missions, err := h.svc.ListMissions(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list missions")
		return
	}
	writeJSON(w, http.StatusOK, missions)
}

func (h *MissionHandler) GetMission(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	mission, err := h.svc.GetMission(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get mission")
		return
	}
	if mission == nil {
		writeError(w, http.StatusNotFound, "mission not found")
		return
	}
	writeJSON(w, http.StatusOK, mission)
}

func (h *MissionHandler) GetActiveMission(w http.ResponseWriter, r *http.Request) {
	mission, err := h.svc.GetActiveMission(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get active mission")
		return
	}
	if mission == nil {
		writeError(w, http.StatusNotFound, "no active mission")
		return
	}
	writeJSON(w, http.StatusOK, mission)
}

func (h *MissionHandler) GetSections(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	sections, err := h.svc.GetSections(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get sections")
		return
	}
	if sections == nil {
		sections = []domain.MissionSection{}
	}
	writeJSON(w, http.StatusOK, sections)
}

func (h *MissionHandler) GetMilestones(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	milestones, err := h.svc.GetMilestones(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get milestones")
		return
	}
	if milestones == nil {
		milestones = []domain.Milestone{}
	}
	writeJSON(w, http.StatusOK, milestones)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
