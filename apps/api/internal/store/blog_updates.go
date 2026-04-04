package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/onnwee/artemis/apps/api/internal/domain"
)

type BlogUpdateStore struct {
	db *DB
}

func NewBlogUpdateStore(db *DB) *BlogUpdateStore {
	return &BlogUpdateStore{db: db}
}

func (s *BlogUpdateStore) Upsert(ctx context.Context, u *domain.BlogUpdate) error {
	_, err := s.db.ExecContext(ctx,
		`INSERT INTO blog_updates (id, mission_id, source, title, url, author, summary, image_url, published_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		 ON CONFLICT(url) DO UPDATE SET
		   title = excluded.title,
		   summary = excluded.summary,
		   image_url = excluded.image_url`,
		u.ID, nullString(u.MissionID), u.Source, u.Title, u.URL, u.Author, u.Summary, u.ImageURL, u.PublishedAt.Format(time.RFC3339),
	)
	return err
}

func (s *BlogUpdateStore) List(ctx context.Context, source string, limit, offset int) ([]domain.BlogUpdate, error) {
	query := `SELECT id, mission_id, source, title, url, author, summary, image_url, published_at, created_at FROM blog_updates`
	var args []any

	if source != "" {
		query += ` WHERE source = ?`
		args = append(args, source)
	}
	query += ` ORDER BY published_at DESC`

	if limit > 0 {
		query += ` LIMIT ?`
		args = append(args, limit)
	}
	if offset > 0 {
		query += ` OFFSET ?`
		args = append(args, offset)
	}

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list updates: %w", err)
	}
	defer rows.Close()

	return scanBlogUpdates(rows)
}

func (s *BlogUpdateStore) Latest(ctx context.Context, limit int) ([]domain.BlogUpdate, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, mission_id, source, title, url, author, summary, image_url, published_at, created_at
		 FROM blog_updates ORDER BY published_at DESC LIMIT ?`, limit)
	if err != nil {
		return nil, fmt.Errorf("latest updates: %w", err)
	}
	defer rows.Close()
	return scanBlogUpdates(rows)
}

func (s *BlogUpdateStore) ByMission(ctx context.Context, missionID string, limit int) ([]domain.BlogUpdate, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, mission_id, source, title, url, author, summary, image_url, published_at, created_at
		 FROM blog_updates WHERE mission_id = ? ORDER BY published_at DESC LIMIT ?`, missionID, limit)
	if err != nil {
		return nil, fmt.Errorf("mission updates: %w", err)
	}
	defer rows.Close()
	return scanBlogUpdates(rows)
}

func scanBlogUpdates(rows *sql.Rows) ([]domain.BlogUpdate, error) {
	var updates []domain.BlogUpdate
	for rows.Next() {
		var u domain.BlogUpdate
		var missionID, publishedAt, createdAt sql.NullString
		if err := rows.Scan(&u.ID, &missionID, &u.Source, &u.Title, &u.URL, &u.Author, &u.Summary, &u.ImageURL, &publishedAt, &createdAt); err != nil {
			return nil, fmt.Errorf("scan update: %w", err)
		}
		if missionID.Valid {
			u.MissionID = missionID.String
		}
		if publishedAt.Valid {
			u.PublishedAt, _ = time.Parse(time.RFC3339, publishedAt.String)
		}
		if createdAt.Valid {
			u.CreatedAt, _ = time.Parse(time.RFC3339, createdAt.String)
		}
		updates = append(updates, u)
	}
	return updates, rows.Err()
}

func nullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: s, Valid: true}
}
