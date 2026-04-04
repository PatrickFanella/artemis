package handlers

import (
	"net/http"
	"strconv"

	"github.com/onnwee/artemis/apps/api/internal/service"
)

type ActiveHandler struct {
	svc *service.ActiveService
}

func NewActiveHandler(svc *service.ActiveService) *ActiveHandler {
	return &ActiveHandler{svc: svc}
}

func (h *ActiveHandler) GetDashboard(w http.ResponseWriter, r *http.Request) {
	dashboard, err := h.svc.GetDashboard(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get dashboard")
		return
	}
	if dashboard == nil {
		writeError(w, http.StatusNotFound, "no active mission")
		return
	}
	writeJSON(w, http.StatusOK, dashboard)
}

func (h *ActiveHandler) GetTelemetry(w http.ResponseWriter, r *http.Request) {
	telemetry, err := h.svc.GetTelemetry(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get telemetry")
		return
	}
	if telemetry == nil {
		writeError(w, http.StatusNotFound, "no active mission")
		return
	}
	writeJSON(w, http.StatusOK, telemetry)
}

func (h *ActiveHandler) GetEvents(w http.ResponseWriter, r *http.Request) {
	fdStr := r.URL.Query().Get("fd")
	fd := 0
	if fdStr != "" {
		var err error
		fd, err = strconv.Atoi(fdStr)
		if err != nil || fd < 0 {
			writeError(w, http.StatusBadRequest, "invalid flight day")
			return
		}
	}

	resp, err := h.svc.GetEvents(r.Context(), fd)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get events")
		return
	}
	if resp == nil {
		writeError(w, http.StatusNotFound, "no active mission")
		return
	}
	writeJSON(w, http.StatusOK, resp)
}
