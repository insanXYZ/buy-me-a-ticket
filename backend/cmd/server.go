package main

import (
	"buymeaticket-backend/internal/app"
	"buymeaticket-backend/internal/controllers"
	"buymeaticket-backend/internal/database"
	"buymeaticket-backend/internal/repository"
	"buymeaticket-backend/internal/services"
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

	userRepository := repository.NewUserRepository(db)
	ticketRepository := repository.NewTicketRepository(db)
	ticketCategoryRepository := repository.NewTicketCategoryRepository(db)
	ticketVariantRepository := repository.NewTicketVariantRepository(db)
	ticketDetailRepository := repository.NewTicketDetailRepository(db)

	userService := services.NewUserService(v, userRepository)
	authService := services.NewAuthService(v, userRepository)
	ticketService := services.NewTicketService(v, ticketRepository, ticketCategoryRepository, ticketVariantRepository, ticketDetailRepository)

	userController := controllers.NewUserController(userService)
	authController := controllers.NewAuthController(authService)
	ticketController := controllers.NewTicketController(ticketService)

	wrapController := controllers.WrapController{
		AuthController:   authController,
		TicketController: ticketController,
		UserController:   userController,
	}

	app.NewGraphHandler(e, v, db, &wrapController)
	app.NewRestHandler(e)

	fmt.Printf("running server on port %v", port)
	if err := e.Start(port); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
