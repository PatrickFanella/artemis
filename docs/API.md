# Artemis API frontend integration guide

The source-of-truth machine-readable contract is [`apps/api/api/openapi.yaml`](../apps/api/api/openapi.yaml).

## Base URL

Local API default:

```txt
http://localhost:8090
```

Frontend convention:

```ts
const API_BASE = import.meta.env.VITE_API_URL ?? "";
```

Use `VITE_API_URL=http://localhost:8090` when the frontend talks directly to the local API. Leave it unset when requests are same-origin or proxied.

The existing Vite dev server proxies `/api` and `/healthz` to `http://localhost:8090`.

## Auth and CORS

- The current API is public and read-only.
- No JWT, cookie session, or API key is required.
- CORS allows all origins for `GET` and `OPTIONS`.

## Response format

All documented endpoints return JSON.

Errors use this shape:

```json
{
  "error": "mission not found"
}
```

List endpoints return `[]` when there are no items.

## Endpoints

### Health

```txt
GET /healthz
```

Returns:

```json
{ "status": "ok" }
```

### Missions

```txt
GET /api/v1/missions
GET /api/v1/missions/active
GET /api/v1/missions/{id}
GET /api/v1/missions/{id}/sections
GET /api/v1/missions/{id}/milestones
GET /api/v1/missions/{id}/events?fd={flightDay}
```

The events endpoint returns a per-mission event timeline. The optional `fd`
query parameter filters to a single flight day. Event statuses are computed
from the mission's launch date: `completed` for past events, `active` for the
current event, and `upcoming` for future events.

### Updates

```txt
GET /api/v1/updates?source={source}&limit={limit}&offset={offset}
GET /api/v1/updates/latest
GET /api/v1/missions/{id}/updates?limit={limit}
```

Query params:

| Name | Type | Notes |
| --- | --- | --- |
| `source` | string | Optional source filter. |
| `limit` | number | Optional maximum result count. Invalid values currently behave like `0`. |
| `offset` | number | Optional result offset. Invalid values currently behave like `0`. |

### Media

```txt
GET /api/v1/media?q={query}&type={type}&year={year}&page={page}
```

Query params:

| Name | Type | Notes |
| --- | --- | --- |
| `q` | string | Search query. Defaults to `artemis` when omitted or empty. |
| `type` | string | Optional NASA media type filter, for example `image` or `video`. |
| `year` | number | Optional start year. Invalid values currently behave like `0`. |
| `page` | number | Optional result page. Invalid values currently behave like `0`. |

### Active mission dashboard

```txt
GET /api/v1/active
GET /api/v1/active/telemetry
GET /api/v1/active/events?fd={flightDay}
```

Query params:

| Name | Type | Notes |
| --- | --- | --- |
| `fd` | number | Optional flight day filter. Non-integer or negative values return `400`. |

## TypeScript usage

Existing frontend types live in [`apps/web/src/lib/types.ts`](../apps/web/src/lib/types.ts). Existing wrappers live in [`apps/web/src/api`](../apps/web/src/api).

Minimal request helper:

```ts
const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

Example:

```ts
import type { Mission } from "../lib/types";

const missions = await apiGet<Mission[]>("/api/v1/missions");
```

## Schema source files

- Backend route registration: [`apps/api/internal/http/router/router.go`](../apps/api/internal/http/router/router.go)
- Backend response models: [`apps/api/internal/domain/models.go`](../apps/api/internal/domain/models.go)
- Frontend type mirror: [`apps/web/src/lib/types.ts`](../apps/web/src/lib/types.ts)
- OpenAPI contract: [`apps/api/api/openapi.yaml`](../apps/api/api/openapi.yaml)

## Notes for frontend implementation

- Treat `404` from active mission endpoints as “no active mission available”.
- Poll `/api/v1/active` or `/api/v1/active/telemetry` if live dashboard freshness is needed.
- Prefer the OpenAPI spec for generated clients/types; keep hand-written wrappers thin.
