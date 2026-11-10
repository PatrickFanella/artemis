# Artemis Mission Hub

A web dashboard for NASA's Artemis missions. It collects mission schedules,
milestones, NASA blog updates, images and video, and live trajectory data from
official NASA sources, and shows them in one place.

It is a prototype. Live telemetry depends on what the sources publish at the
time, and it is not an official navigation or safety system. The site runs at
[artemis.subcult.tv](https://artemis.subcult.tv/).

## Features

- **Missions:** an overview of the Artemis campaign and a page per mission with
  sections, milestones, events and crew.
- **Schedule:** the active mission's event timeline, with events marked
  completed or active as their times pass and times shown in your local zone.
- **Active mission view:** a mission clock and live trajectory (distance and
  speed, in km or mph) pulled from NASA JPL Horizons.
- **Updates:** NASA Artemis blog posts ingested from RSS on a schedule, with
  articles rendered on the site.
- **Media:** search of the NASA Image and Video Library, and the Astronomy
  Picture of the Day.
- **Public read-only API** with an OpenAPI description and Prometheus metrics at
  `/metrics`. Calls to NASA services are rate limited, cached and retried with
  backoff.
- **Prerendered pages** for search engines and link previews.

An early iOS app project (SwiftUI) is in `apps/mobile/ios`.

## Quick start

You need Go 1.25, Node.js 22 and pnpm 10.

```bash
pnpm install
make dev        # API on http://localhost:8090 and the Vite dev server
```

`make api` and `make web` start them separately. The Vite dev server proxies
`/api` and `/healthz` to the API.

Checks:

```bash
cd apps/api && go vet ./... && go test ./...
pnpm --filter @artemis/web lint
pnpm --filter @artemis/web build   # typecheck, build and prerender
```

## Configuration

The API reads these environment variables:

| Variable       | Default      | Purpose                                                                     |
| -------------- | ------------ | --------------------------------------------------------------------------- |
| `PORT`         | `8090`       | API port.                                                                   |
| `DB_PATH`      | `artemis.db` | SQLite database file. Migrations run on start.                              |
| `LOG_LEVEL`    | `info`       | Log level.                                                                  |
| `NASA_API_KEY` | `DEMO_KEY`   | Key for api.nasa.gov (used for APOD). The demo key is heavily rate limited. |

The web app reads `VITE_API_URL` at build time. Leave it empty when the API is
served from the same origin.

## Deploy

Two images:

- `apps/api/Dockerfile`: the Go API. It runs as a non-root user, so set
  `DB_PATH` to a file in a writable volume (the Compose file uses
  `DB_PATH=/data/artemis.db` with `./data/artemis` mounted at `/data`).
- `apps/web/Dockerfile` (build from the repository root): the built and
  prerendered site served by nginx on port 80.

The nginx config serves static files only, so route `/api` and `/healthz` to
the API from your reverse proxy, or build the web app with `VITE_API_URL`
pointing at the API.

The root `docker-compose.yml` runs both containers on external Docker networks
named `projects` and `monitoring` and publishes no ports; it expects a reverse
proxy on the `projects` network. Create those networks or adapt the file.

The API contract is in [`apps/api/api/openapi.yaml`](apps/api/api/openapi.yaml),
and [`docs/API.md`](docs/API.md) explains how the frontend uses it.

## Project layout

```text
apps/api      Go API: handlers, NASA clients, RSS and article jobs, SQLite store
apps/web      React, TypeScript, Vite and Tailwind site with a prerender step
apps/mobile   iOS app project
docs/         API guide for the frontend
plan.md       research notes on the NASA sources
```

## Data and attribution

Mission facts and media link back to their NASA sources. Dates and mission
status change; check the current NASA page before quoting a time-sensitive
detail. NASA content and marks are subject to NASA's own usage and attribution
rules.

## Contributing

- Report bugs and request features in [GitHub issues](https://github.com/subculture-collective/artemis/issues).
- Ask questions and share ideas in [GitHub Discussions](https://github.com/subculture-collective/artemis/discussions).
- Send code as a pull request on GitHub against `main`. CI vets, tests and
  builds the Go API and lints, typechecks and builds the web app on every pull
  request; both must pass before it can merge.

## License

The source code is licensed under the GNU General Public License, version 3 or
later (`GPL-3.0-or-later`). See [LICENSE](LICENSE).
