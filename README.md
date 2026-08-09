# Artemis Mission Hub

A full-stack mission dashboard that brings official Artemis schedules, mission
milestones, NASA updates, media, and best-effort telemetry into one interface.

## Status

This repository is an active prototype. It contains a Go API, a React and
TypeScript web application, scheduled NASA update ingestion, and a SQLite data
store. Live telemetry depends on source availability and must not be treated as
an official navigation or safety system.

## Architecture

| Area | Implementation |
| --- | --- |
| Web client | React, TypeScript, Vite |
| API and ingestion | Go |
| Storage | SQLite migrations and repositories |
| Sources | Official NASA mission pages, feeds, and media services |
| Local runtime | pnpm workspace and Docker Compose |

The backend normalizes several official sources behind one application API.
Source-specific limitations and the research behind that choice are documented
in [`plan.md`](plan.md).

## Run locally

Requirements: Go, Node.js, pnpm, and the source-specific environment variables
used by the API configuration.

```bash
pnpm install
make dev
```

Run the services separately with `make api` and `make web`.

## Verification

```bash
make test
make lint
```

These commands run the Go and web checks defined by the workspace. A passing
local check does not verify the availability or accuracy of an external NASA
source.

## Data and attribution

Mission facts and media should retain links to their official NASA sources.
Dates and mission status can change; do not copy time-sensitive statements from
the planning notes without rechecking the current primary source.

## License

No project-wide license has been declared. NASA content and marks remain subject
to their respective usage and attribution rules.
