.PHONY: api web dev test lint

api:
	cd apps/api && go run ./cmd/server

web:
	pnpm --filter @artemis/web dev

dev:
	$(MAKE) -j2 api web

test:
	cd apps/api && go test ./...
	pnpm --filter @artemis/web test

lint:
	cd apps/api && go vet ./...
	pnpm -r lint
