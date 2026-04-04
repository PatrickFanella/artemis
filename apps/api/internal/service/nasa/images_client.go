package nasa

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/onnwee/artemis/apps/api/internal/domain"
)

const baseURL = "https://images-api.nasa.gov"

type ImagesClient struct {
	client *http.Client
}

func NewImagesClient() *ImagesClient {
	return &ImagesClient{
		client: &http.Client{Timeout: 15 * time.Second},
	}
}

type nasaResponse struct {
	Collection struct {
		Items []struct {
			Data  []nasaItemData `json:"data"`
			Links []nasaLink     `json:"links"`
		} `json:"items"`
		Metadata struct {
			TotalHits int `json:"total_hits"`
		} `json:"metadata"`
	} `json:"collection"`
}

type nasaItemData struct {
	NasaID       string   `json:"nasa_id"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	MediaType    string   `json:"media_type"`
	DateCreated  string   `json:"date_created"`
	Center       string   `json:"center"`
	Photographer string   `json:"photographer"`
	Keywords     []string `json:"keywords"`
}

type nasaLink struct {
	Href string `json:"href"`
	Rel  string `json:"rel"`
}

func (c *ImagesClient) Search(ctx context.Context, query, mediaType string, yearStart int, page int) (*domain.MediaSearchResult, error) {
	params := url.Values{}
	params.Set("q", query)
	if mediaType != "" {
		params.Set("media_type", mediaType)
	}
	if yearStart > 0 {
		params.Set("year_start", fmt.Sprintf("%d", yearStart))
	}
	if page > 1 {
		params.Set("page", fmt.Sprintf("%d", page))
	}

	reqURL := fmt.Sprintf("%s/search?%s", baseURL, params.Encode())
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch NASA images: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("NASA images API returned %d", resp.StatusCode)
	}

	var nasaResp nasaResponse
	if err := json.NewDecoder(resp.Body).Decode(&nasaResp); err != nil {
		return nil, fmt.Errorf("decode response: %w", err)
	}

	result := &domain.MediaSearchResult{
		TotalHits: nasaResp.Collection.Metadata.TotalHits,
	}

	for _, item := range nasaResp.Collection.Items {
		if len(item.Data) == 0 {
			continue
		}
		d := item.Data[0]

		var previewURL string
		for _, link := range item.Links {
			if link.Rel == "preview" {
				previewURL = link.Href
				break
			}
		}

		desc := d.Description
		if len(desc) > 500 {
			desc = desc[:500] + "..."
		}

		result.Items = append(result.Items, domain.MediaAsset{
			NasaID:       d.NasaID,
			Title:        d.Title,
			Description:  desc,
			MediaType:    d.MediaType,
			DateCreated:  d.DateCreated,
			Center:       d.Center,
			Photographer: d.Photographer,
			Keywords:     d.Keywords,
			PreviewURL:   previewURL,
		})
	}

	if result.Items == nil {
		result.Items = []domain.MediaAsset{}
	}

	return result, nil
}
