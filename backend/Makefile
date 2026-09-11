graph-generate:
	go tool gqlgen generate

migrate-create:
	migrate create -ext sql -dir internal/database/migrations -seq create_${name}_table

migrate-version:
	migrate -database ${url} -path internal/database/migrations version

migrate-force:
	migrate -database ${url} -path internal/database/migrations force ${version}

migrate-up:
	migrate -database ${url} -path internal/database/migrations up ${num}

migrate-down:
	migrate -database ${url} -path internal/database/migrations down ${num}

run:
	go run cmd/server.go
