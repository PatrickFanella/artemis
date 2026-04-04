package jobs

import (
	"context"
	"crypto/sha256"
	"fmt"
	"strings"
	"time"

	"github.com/mmcdole/gofeed"
	"github.com/onnwee/artemis/apps/api/internal/domain"
	"github.com/onnwee/artemis/apps/api/internal/store"
	"github.com/rs/zerolog/log"
)

type FeedConfig struct {
	URL    string
	Source string
	Filter string // only ingest items matching this keyword (empty = all)
}

type RSSIngester struct {
	store  *store.BlogUpdateStore
	feeds  []FeedConfig
	parser *gofeed.Parser
}

func NewRSSIngester(s *store.BlogUpdateStore) *RSSIngester {
	return &RSSIngester{
		store:  s,
		parser: gofeed.NewParser(),
		feeds: []FeedConfig{
			{
				URL:    "https://www.nasa.gov/feeds/iotd-feed/",
				Source: "iotd",
				Filter: "",
			},
			{
				URL:    "https://www.nasa.gov/rss/dyn/breaking_news.rss",
				Source: "nasa_news",
				Filter: "artemis",
			},
		},
	}
}

func (r *RSSIngester) Run(ctx context.Context) {
	for _, fc := range r.feeds {
		if err := r.ingestFeed(ctx, fc); err != nil {
			log.Error().Err(err).Str("source", fc.Source).Msg("failed to ingest feed")
		}
	}
}

func (r *RSSIngester) ingestFeed(ctx context.Context, fc FeedConfig) error {
	ctxTimeout, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	feed, err := r.parser.ParseURLWithContext(fc.URL, ctxTimeout)
	if err != nil {
		return fmt.Errorf("parse feed %s: %w", fc.URL, err)
	}

	var ingested int
	for _, item := range feed.Items {
		if fc.Filter != "" && !matchesFilter(item, fc.Filter) {
			continue
		}

		update := itemToUpdate(item, fc.Source)
		if err := r.store.Upsert(ctx, &update); err != nil {
			log.Error().Err(err).Str("url", item.Link).Msg("upsert failed")
			continue
		}
		ingested++
	}

	log.Info().Str("source", fc.Source).Int("total", len(feed.Items)).Int("ingested", ingested).Msg("feed ingested")
	return nil
}

func matchesFilter(item *gofeed.Item, keyword string) bool {
	kw := strings.ToLower(keyword)
	if strings.Contains(strings.ToLower(item.Title), kw) {
		return true
	}
	if strings.Contains(strings.ToLower(item.Description), kw) {
		return true
	}
	for _, cat := range item.Categories {
		if strings.Contains(strings.ToLower(cat), kw) {
			return true
		}
	}
	return false
}

func itemToUpdate(item *gofeed.Item, source string) domain.BlogUpdate {
	id := fmt.Sprintf("%x", sha256.Sum256([]byte(item.Link)))[:16]

	var author string
	if item.Author != nil {
		author = item.Author.Name
	}

	summary := item.Description
	if len(summary) > 500 {
		summary = summary[:500] + "..."
	}

	var imageURL string
	if item.Image != nil {
		imageURL = item.Image.URL
	}
	if imageURL == "" {
		for _, enc := range item.Enclosures {
			if strings.HasPrefix(enc.Type, "image/") {
				imageURL = enc.URL
				break
			}
		}
	}

	var publishedAt time.Time
	if item.PublishedParsed != nil {
		publishedAt = *item.PublishedParsed
	} else {
		publishedAt = time.Now()
	}

	var missionID string
	titleLower := strings.ToLower(item.Title)
	if strings.Contains(titleLower, "artemis ii") || strings.Contains(titleLower, "artemis 2") {
		missionID = "artemis-2"
	}

	return domain.BlogUpdate{
		ID:          id,
		MissionID:   missionID,
		Source:      source,
		Title:       item.Title,
		URL:         item.Link,
		Author:      author,
		Summary:     summary,
		ImageURL:    imageURL,
		PublishedAt: publishedAt,
	}
}
