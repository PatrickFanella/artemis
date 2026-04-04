CREATE TABLE missions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming',
    launch_date TEXT,
    duration TEXT,
    crew_json TEXT DEFAULT '[]',
    image_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE mission_sections (
    id TEXT PRIMARY KEY,
    mission_id TEXT NOT NULL REFERENCES missions(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    day_range TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming'
);

CREATE TABLE milestones (
    id TEXT PRIMARY KEY,
    mission_id TEXT NOT NULL REFERENCES missions(id),
    section_id TEXT REFERENCES mission_sections(id),
    title TEXT NOT NULL,
    description TEXT,
    planned_at TEXT,
    completed_at TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);
