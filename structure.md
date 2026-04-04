repo/
├─ apps/
│  ├─ api/
│  │  ├─ go.mod
│  │  ├─ cmd/
│  │  │  └─ server/
│  │  │     └─ main.go
│  │  ├─ internal/
│  │  │  ├─ config/
│  │  │  ├─ http/
│  │  │  │  ├─ handlers/
│  │  │  │  ├─ middleware/
│  │  │  │  └─ router/
│  │  │  ├─ service/
│  │  │  ├─ store/
│  │  │  ├─ domain/
│  │  │  └─ jobs/
│  │  ├─ migrations/
│  │  ├─ api/
│  │  │  └─ openapi.yaml
│  │  ├─ test/
│  │  └─ Dockerfile
│  │
│  └─ web/
│     ├─ package.json
│     ├─ src/
│     │  ├─ app/          # if framework
│     │  ├─ routes/       # if SPA router
│     │  ├─ components/
│     │  ├─ features/
│     │  ├─ hooks/
│     │  ├─ lib/
│     │  ├─ api/
│     │  └─ styles/
│     ├─ public/
│     ├─ vite.config.ts   # or framework config
│     └─ Dockerfile
│
├─ packages/
│  ├─ ui/                 # shared React component library
│  ├─ tsconfig/           # shared TS config
│  ├─ eslint-config/      # shared lint config
│  └─ api-client/         # generated TS client from OpenAPI
│
├─ infra/
│  ├─ docker/
│  ├─ compose/
│  └─ k8s/                # optional
│
├─ scripts/
├─ docs/
├─ .github/
│  └─ workflows/
├─ pnpm-workspace.yaml
├─ package.json
├─ turbo.json             # optional
├─ Makefile or Taskfile.yml
└─ README.md
