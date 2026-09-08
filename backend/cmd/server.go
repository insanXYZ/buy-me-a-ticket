package main

import (
	"buymeaticket-backend/internal/app"
	"buymeaticket-backend/internal/database"
	"fmt"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
)

const defaultPort = ":8000"

func main() {

	err := godotenv.Load()
	if err != nil {
		panic("cant load .env file")
	}

	db, err := database.NewGorm()
	if err != nil {
		panic("cant connect to database")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	v := validator.New()
	e := echo.New()

	app.NewGraphHandler(e, v, db)
	app.NewRestHandler(e)

	fmt.Printf("running server on port %v", port)
	if err := e.Start(port); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
