package handlers

import (
	"net/http"
	"strconv"

	"github.com/onnwee/artemis/apps/api/internal/service/nasa"
)

type MediaHandler struct {
	client *nasa.ImagesClient
}

func NewMediaHandler(client *nasa.ImagesClient) *MediaHandler {
	return &MediaHandler{client: client}
}

func (h *MediaHandler) Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		query = "artemis"
	}
	mediaType := r.URL.Query().Get("type")
	yearStart, _ := strconv.Atoi(r.URL.Query().Get("year"))
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))

	result, err := h.client.Search(r.Context(), query, mediaType, yearStart, page)
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to search NASA media")
		return
	}

	writeJSON(w, http.StatusOK, result)
}
