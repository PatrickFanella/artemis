-- Add full-text content column for imported articles (markdown body).
ALTER TABLE blog_updates ADD COLUMN content TEXT NOT NULL DEFAULT '';