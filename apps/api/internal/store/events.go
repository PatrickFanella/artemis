package store

import (
	"context"
	"fmt"

	"github.com/onnwee/artemis/apps/api/internal/domain"
)

type EventStore struct {
	db *DB
}

func NewEventStore(db *DB) *EventStore {
	return &EventStore{db: db}
}

func (s *EventStore) List(ctx context.Context, missionID string) ([]domain.MissionEvent, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, mission_id, met_seconds, flight_day, category, title, description
		 FROM mission_events WHERE mission_id = ? ORDER BY met_seconds`, missionID)
	if err != nil {
		return nil, fmt.Errorf("list events: %w", err)
	}
	defer rows.Close()

	var events []domain.MissionEvent
	for rows.Next() {
		var e domain.MissionEvent
		if err := rows.Scan(&e.ID, &e.MissionID, &e.MetSeconds, &e.FlightDay, &e.Category, &e.Title, &e.Description); err != nil {
			return nil, fmt.Errorf("scan event: %w", err)
		}
		events = append(events, e)
	}
	return events, rows.Err()
}

func (s *EventStore) ByFlightDay(ctx context.Context, missionID string, fd int) ([]domain.MissionEvent, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, mission_id, met_seconds, flight_day, category, title, description
		 FROM mission_events WHERE mission_id = ? AND flight_day = ? ORDER BY met_seconds`, missionID, fd)
	if err != nil {
		return nil, fmt.Errorf("events by flight day: %w", err)
	}
	defer rows.Close()

	var events []domain.MissionEvent
	for rows.Next() {
		var e domain.MissionEvent
		if err := rows.Scan(&e.ID, &e.MissionID, &e.MetSeconds, &e.FlightDay, &e.Category, &e.Title, &e.Description); err != nil {
			return nil, fmt.Errorf("scan event: %w", err)
		}
		events = append(events, e)
	}
	return events, rows.Err()
}

// Recent returns the N most recent events before the given MET
func (s *EventStore) Recent(ctx context.Context, missionID string, metSeconds int, limit int) ([]domain.MissionEvent, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, mission_id, met_seconds, flight_day, category, title, description
		 FROM mission_events WHERE mission_id = ? AND met_seconds <= ?
		 ORDER BY met_seconds DESC LIMIT ?`, missionID, metSeconds, limit)
	if err != nil {
		return nil, fmt.Errorf("recent events: %w", err)
	}
	defer rows.Close()

	var events []domain.MissionEvent
	for rows.Next() {
		var e domain.MissionEvent
		if err := rows.Scan(&e.ID, &e.MissionID, &e.MetSeconds, &e.FlightDay, &e.Category, &e.Title, &e.Description); err != nil {
			return nil, fmt.Errorf("scan event: %w", err)
		}
		e.Status = "completed"
		events = append(events, e)
	}
	return events, rows.Err()
}

// Upcoming returns the next N events after the given MET
func (s *EventStore) Upcoming(ctx context.Context, missionID string, metSeconds int, limit int) ([]domain.MissionEvent, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, mission_id, met_seconds, flight_day, category, title, description
		 FROM mission_events WHERE mission_id = ? AND met_seconds > ?
		 ORDER BY met_seconds ASC LIMIT ?`, missionID, metSeconds, limit)
	if err != nil {
		return nil, fmt.Errorf("upcoming events: %w", err)
	}
	defer rows.Close()

	var events []domain.MissionEvent
	for rows.Next() {
		var e domain.MissionEvent
		if err := rows.Scan(&e.ID, &e.MissionID, &e.MetSeconds, &e.FlightDay, &e.Category, &e.Title, &e.Description); err != nil {
			return nil, fmt.Errorf("scan event: %w", err)
		}
		e.Status = "upcoming"
		events = append(events, e)
	}
	return events, rows.Err()
}

// FlightDayCount returns the total number of flight days for a mission
func (s *EventStore) FlightDayCount(ctx context.Context, missionID string) (int, error) {
	var count int
	err := s.db.QueryRowContext(ctx,
		`SELECT COALESCE(MAX(flight_day), 0) FROM mission_events WHERE mission_id = ?`, missionID).Scan(&count)
	return count, err
}
