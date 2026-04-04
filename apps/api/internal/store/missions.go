package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/onnwee/artemis/apps/api/internal/domain"
)

type MissionStore struct {
	db *DB
}

func NewMissionStore(db *DB) *MissionStore {
	return &MissionStore{db: db}
}

func (s *MissionStore) ListMissions(ctx context.Context) ([]domain.Mission, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT id, name, tagline, description, status, launch_date, duration, crew_json, image_url, created_at, updated_at FROM missions ORDER BY launch_date`)
	if err != nil {
		return nil, fmt.Errorf("list missions: %w", err)
	}
	defer rows.Close()

	var missions []domain.Mission
	for rows.Next() {
		m, err := scanMission(rows)
		if err != nil {
			return nil, err
		}
		missions = append(missions, m)
	}
	return missions, rows.Err()
}

func (s *MissionStore) GetMission(ctx context.Context, id string) (*domain.Mission, error) {
	row := s.db.QueryRowContext(ctx, `SELECT id, name, tagline, description, status, launch_date, duration, crew_json, image_url, created_at, updated_at FROM missions WHERE id = ?`, id)
	m, err := scanMissionRow(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get mission %s: %w", id, err)
	}
	return &m, nil
}

func (s *MissionStore) GetActiveMission(ctx context.Context) (*domain.Mission, error) {
	row := s.db.QueryRowContext(ctx, `SELECT id, name, tagline, description, status, launch_date, duration, crew_json, image_url, created_at, updated_at FROM missions WHERE status = 'active' LIMIT 1`)
	m, err := scanMissionRow(row)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get active mission: %w", err)
	}
	return &m, nil
}

func (s *MissionStore) GetSections(ctx context.Context, missionID string) ([]domain.MissionSection, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT id, mission_id, name, slug, description, "order", day_range, status FROM mission_sections WHERE mission_id = ? ORDER BY "order"`, missionID)
	if err != nil {
		return nil, fmt.Errorf("get sections: %w", err)
	}
	defer rows.Close()

	var sections []domain.MissionSection
	for rows.Next() {
		var sec domain.MissionSection
		if err := rows.Scan(&sec.ID, &sec.MissionID, &sec.Name, &sec.Slug, &sec.Description, &sec.Order, &sec.DayRange, &sec.Status); err != nil {
			return nil, fmt.Errorf("scan section: %w", err)
		}
		sections = append(sections, sec)
	}
	return sections, rows.Err()
}

func (s *MissionStore) GetMilestones(ctx context.Context, missionID string) ([]domain.Milestone, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT id, mission_id, section_id, title, description, planned_at, completed_at, "order" FROM milestones WHERE mission_id = ? ORDER BY "order"`, missionID)
	if err != nil {
		return nil, fmt.Errorf("get milestones: %w", err)
	}
	defer rows.Close()

	var milestones []domain.Milestone
	for rows.Next() {
		var ms domain.Milestone
		var plannedAt, completedAt sql.NullString
		var sectionID sql.NullString
		if err := rows.Scan(&ms.ID, &ms.MissionID, &sectionID, &ms.Title, &ms.Description, &plannedAt, &completedAt, &ms.Order); err != nil {
			return nil, fmt.Errorf("scan milestone: %w", err)
		}
		if sectionID.Valid {
			ms.SectionID = sectionID.String
		}
		if plannedAt.Valid {
			t, _ := time.Parse(time.RFC3339, plannedAt.String)
			ms.PlannedAt = &t
		}
		if completedAt.Valid {
			t, _ := time.Parse(time.RFC3339, completedAt.String)
			ms.CompletedAt = &t
		}
		milestones = append(milestones, ms)
	}
	return milestones, rows.Err()
}

type scanner interface {
	Scan(dest ...any) error
}

func scanMissionFields(s scanner) (domain.Mission, error) {
	var m domain.Mission
	var launchDate, createdAt, updatedAt sql.NullString
	if err := s.Scan(&m.ID, &m.Name, &m.Tagline, &m.Description, &m.Status, &launchDate, &m.Duration, &m.CrewJSON, &m.ImageURL, &createdAt, &updatedAt); err != nil {
		return m, err
	}
	if launchDate.Valid {
		t, _ := time.Parse(time.RFC3339, launchDate.String)
		m.LaunchDate = &t
	}
	if createdAt.Valid {
		m.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
	}
	if updatedAt.Valid {
		m.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt.String)
	}
	if m.CrewJSON != "" {
		json.Unmarshal([]byte(m.CrewJSON), &m.Crew)
	}
	if m.Crew == nil {
		m.Crew = []domain.CrewMember{}
	}
	return m, nil
}

func scanMission(rows *sql.Rows) (domain.Mission, error) {
	return scanMissionFields(rows)
}

func scanMissionRow(row *sql.Row) (domain.Mission, error) {
	return scanMissionFields(row)
}
