package handlers

import (
	"net/http"
	"strconv"

	"github.com/onnwee/artemis/apps/api/internal/service/nasa"
)

type MediaHandler struct {
	client *nasa.ImagesClient
	apod   *nasa.ApodClient
}

func NewMediaHandler(client *nasa.ImagesClient, apod *nasa.ApodClient) *MediaHandler {
	return &MediaHandler{client: client, apod: apod}
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

func (h *MediaHandler) Apod(w http.ResponseWriter, r *http.Request) {
	apod, err := h.apod.Fetch(r.Context())
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to fetch APOD")
		return
	}
	writeJSON(w, http.StatusOK, apod)
}
