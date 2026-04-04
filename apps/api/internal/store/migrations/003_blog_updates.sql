CREATE TABLE blog_updates (
    id TEXT PRIMARY KEY,
    mission_id TEXT REFERENCES missions(id),
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    author TEXT,
    summary TEXT,
    image_url TEXT,
    published_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_blog_updates_source ON blog_updates(source);
CREATE INDEX idx_blog_updates_published ON blog_updates(published_at DESC);
CREATE INDEX idx_blog_updates_mission ON blog_updates(mission_id);
