graph-generate:
	go tool gqlgen generate

migrate-create:
	migrate create -ext sql -dir internal/database/migrations -seq create_${name}_table

migrate-up:
	migrate -database ${url} -path internal/database/migrations up

run:
	go run cmd/server.go
