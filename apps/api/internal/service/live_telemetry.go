package service

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/rs/zerolog/log"
)

// LiveTelemetry polls NASA JPL Horizons for real-time Artemis II position.
type LiveTelemetry struct {
	mu      sync.RWMutex
	current *LivePoint
	client  *http.Client
}

// LivePoint represents a single telemetry reading.
type LivePoint struct {
	EarthDistanceKm float64   `json:"earth_distance_km"`
	MoonDistanceKm  float64   `json:"moon_distance_km"`
	VelocityKmh     float64   `json:"velocity_kmh"`
	FetchedAt       time.Time `json:"fetched_at"`
}

func NewLiveTelemetry() *LiveTelemetry {
	return &LiveTelemetry{
		client: &http.Client{Timeout: 15 * time.Second},
	}
}

// Get returns the latest cached telemetry, or nil if unavailable/stale.
func (lt *LiveTelemetry) Get() *LivePoint {
	lt.mu.RLock()
	defer lt.mu.RUnlock()
	if lt.current == nil || time.Since(lt.current.FetchedAt) > 10*time.Minute {
		return nil
	}
	return lt.current
}

// Poll fetches a fresh position from NASA JPL Horizons API.
// Uses geocentric vectors for Artemis II (SPKID -1024) and the Moon (301)
// to compute distances and velocity.
func (lt *LiveTelemetry) Poll(ctx context.Context) {
	now := time.Now().UTC()
	timeStr := now.Format("2006-01-02T15:04")
	endStr := now.Add(time.Minute).Format("2006-01-02T15:04")

	// Fetch Artemis II position relative to Earth
	scX, scY, scZ, scVX, scVY, scVZ, err := lt.fetchVector(ctx, "-1024", timeStr, endStr)
	if err != nil {
		log.Error().Err(err).Msg("live telemetry: fetch Artemis II vector")
		return
	}

	// Fetch Moon position relative to Earth (for accurate Moon distance)
	moonX, moonY, moonZ, _, _, _, err := lt.fetchVector(ctx, "301", timeStr, endStr)
	if err != nil {
		log.Warn().Err(err).Msg("live telemetry: fetch Moon vector, using approximate")
		moonX, moonY, moonZ = 0, 0, 0 // will use approximate distance
	}

	earthDist := math.Sqrt(scX*scX + scY*scY + scZ*scZ)
	velocity := math.Sqrt(scVX*scVX+scVY*scVY+scVZ*scVZ) * 3600 // km/s → km/h

	var moonDist float64
	if moonX != 0 || moonY != 0 || moonZ != 0 {
		dx := scX - moonX
		dy := scY - moonY
		dz := scZ - moonZ
		moonDist = math.Sqrt(dx*dx + dy*dy + dz*dz)
	} else {
		moonDist = math.Max(0, 384400-earthDist)
	}

	point := &LivePoint{
		EarthDistanceKm: math.Round(earthDist*10) / 10,
		MoonDistanceKm:  math.Round(moonDist*10) / 10,
		VelocityKmh:     math.Round(velocity*10) / 10,
		FetchedAt:       time.Now(),
	}

	lt.mu.Lock()
	lt.current = point
	lt.mu.Unlock()

	log.Info().
		Float64("earth_km", point.EarthDistanceKm).
		Float64("moon_km", point.MoonDistanceKm).
		Float64("vel_kmh", point.VelocityKmh).
		Msg("live telemetry updated from NASA Horizons")
}

// fetchVector queries JPL Horizons for geocentric state vectors.
func (lt *LiveTelemetry) fetchVector(ctx context.Context, command, startTime, stopTime string) (x, y, z, vx, vy, vz float64, err error) {
	params := fmt.Sprintf(
		"format=json&COMMAND='%s'&OBJ_DATA='NO'&MAKE_EPHEM='YES'"+
			"&EPHEM_TYPE='VECTORS'&CENTER='500@399'"+
			"&START_TIME='%s'&STOP_TIME='%s'&STEP_SIZE='1m'&VEC_TABLE='2'",
		command, startTime, stopTime,
	)
	url := "https://ssd.jpl.nasa.gov/api/horizons.api?" + params

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return 0, 0, 0, 0, 0, 0, fmt.Errorf("create request: %w", err)
	}

	resp, err := lt.client.Do(req)
	if err != nil {
		return 0, 0, 0, 0, 0, 0, fmt.Errorf("fetch: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, 0, 0, 0, 0, 0, fmt.Errorf("status %d", resp.StatusCode)
	}

	var result struct {
		Result string `json:"result"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return 0, 0, 0, 0, 0, 0, fmt.Errorf("decode: %w", err)
	}

	return parseHorizonsVectors(result.Result)
}

// parseHorizonsVectors extracts the first XYZ/VXVYVZ from Horizons output.
func parseHorizonsVectors(raw string) (x, y, z, vx, vy, vz float64, err error) {
	soe := strings.Index(raw, "$$SOE")
	eoe := strings.Index(raw, "$$EOE")
	if soe < 0 || eoe < 0 || eoe <= soe {
		return 0, 0, 0, 0, 0, 0, fmt.Errorf("no SOE/EOE markers in response")
	}

	block := raw[soe+5 : eoe]
	re := regexp.MustCompile(`[+-]?\d+\.\d+E[+-]\d+`)
	matches := re.FindAllString(block, 6)
	if len(matches) < 6 {
		return 0, 0, 0, 0, 0, 0, fmt.Errorf("expected 6 values, got %d", len(matches))
	}

	vals := make([]float64, 6)
	for i, m := range matches[:6] {
		v, e := strconv.ParseFloat(m, 64)
		if e != nil {
			return 0, 0, 0, 0, 0, 0, fmt.Errorf("parse %q: %w", m, e)
		}
		vals[i] = v
	}

	return vals[0], vals[1], vals[2], vals[3], vals[4], vals[5], nil
}

// StartPoller runs Poll on the given interval until ctx is cancelled.
func (lt *LiveTelemetry) StartPoller(ctx context.Context, interval time.Duration) {
	log.Info().Str("interval", interval.String()).Msg("starting live telemetry poller (NASA Horizons)")

	lt.Poll(ctx)

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Info().Msg("live telemetry poller stopped")
			return
		case <-ticker.C:
			lt.Poll(ctx)
		}
	}
}
