package nasa

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sync"
	"time"
)

// ApodResponse is the Astronomy Picture of the Day payload.
type ApodResponse struct {
	Title       string `json:"title"`
	Explanation string `json:"explanation"`
	URL         string `json:"url"`
	HDURL       string `json:"hdurl,omitempty"`
	MediaType   string `json:"media_type"`
	Date        string `json:"date"`
	Copyright   string `json:"copyright,omitempty"`
}

// ApodClient fetches and caches NASA's Astronomy Picture of the Day.
type ApodClient struct {
	client  *http.Client
	apiKey  string
	mu      sync.RWMutex
	cache   *ApodResponse
	fetched time.Time
}

func NewApodClient(apiKey string) *ApodClient {
	return &ApodClient{
		client: &http.Client{Timeout: 15 * time.Second},
		apiKey: apiKey,
	}
}

func (c *ApodClient) Fetch(ctx context.Context) (*ApodResponse, error) {
	c.mu.RLock()
	if c.cache != nil && time.Since(c.fetched) < 1*time.Hour {
		c.mu.RUnlock()
		return c.cache, nil
	}
	c.mu.RUnlock()

	u := "https://api.nasa.gov/planetary/apod"
	params := url.Values{}
	params.Set("api_key", c.apiKey)
	reqURL := fmt.Sprintf("%s?%s", u, params.Encode())

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create apod request: %w", err)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch apod: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusTooManyRequests {
		// Return stale cache if available
		c.mu.RLock()
		if c.cache != nil {
			c.mu.RUnlock()
			return c.cache, nil
		}
		c.mu.RUnlock()
		return nil, fmt.Errorf("apod rate limited")
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("apod API returned %d", resp.StatusCode)
	}

	var apod ApodResponse
	if err := json.NewDecoder(resp.Body).Decode(&apod); err != nil {
		return nil, fmt.Errorf("decode apod: %w", err)
	}

	c.mu.Lock()
	c.cache = &apod
	c.fetched = time.Now()
	c.mu.Unlock()

	return &apod, nil
}