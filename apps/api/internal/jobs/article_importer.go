package jobs

import (
	"context"
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/store"
	"github.com/rs/zerolog/log"
	"go.yaml.in/yaml/v2"
)

type frontmatter struct {
	Title   string `yaml:"title"`
	URL     string `yaml:"url"`
	Date    string `yaml:"date"`
	Author  string `yaml:"author"`
	FeedURL string `yaml:"feed_url"`
}

// ImportArticles reads markdown files from dir and upserts them as blog_updates
// with source "article".  Existing articles (matched by URL) are not overwritten
// if they already have content.
func ImportArticles(ctx context.Context, s *store.BlogUpdateStore, dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read articles dir: %w", err)
	}

	var imported int
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".md") {
			continue
		}

		path := filepath.Join(dir, entry.Name())
		raw, err := os.ReadFile(path)
		if err != nil {
			log.Warn().Err(err).Str("file", entry.Name()).Msg("skip article")
			continue
		}

		article, err := parseArticle(raw)
		if err != nil {
			log.Warn().Err(err).Str("file", entry.Name()).Msg("skip article")
			continue
		}

		if err := s.Upsert(ctx, article); err != nil {
			log.Warn().Err(err).Str("title", article.Title).Msg("upsert article failed")
			continue
		}
		imported++
	}

	log.Info().Int("imported", imported).Int("total", len(entries)).Msg("articles imported")
	return nil
}

func parseArticle(raw []byte) (*domain.BlogUpdate, error) {
	parts := strings.SplitN(string(raw), "---", 3)
	if len(parts) < 3 {
		return nil, fmt.Errorf("no frontmatter")
	}

	var fm frontmatter
	if err := yaml.Unmarshal([]byte(parts[1]), &fm); err != nil {
		return nil, fmt.Errorf("parse frontmatter: %w", err)
	}

	content := strings.TrimSpace(parts[2])
	summary := content
	if len(summary) > 500 {
		summary = summary[:500] + "..."
	}

	id := fmt.Sprintf("%x", sha256.Sum256([]byte(fm.URL)))[:16]

	publishedAt, err := time.Parse("2006-01-02", fm.Date)
	if err != nil {
		publishedAt = time.Now()
	}

	return &domain.BlogUpdate{
		ID:          id,
		Source:      "article",
		Title:       fm.Title,
		URL:         fm.URL,
		Author:      fm.Author,
		Summary:     summary,
		Content:     content,
		PublishedAt: publishedAt,
	}, nil
}