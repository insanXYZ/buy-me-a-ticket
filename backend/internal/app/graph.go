package app

import (
	"buymeaticket-backend/internal/controllers"
	"buymeaticket-backend/internal/graph"
	"buymeaticket-backend/internal/graph/directive"
	"buymeaticket-backend/internal/middleware"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v5"
	"github.com/vektah/gqlparser/v2/ast"
	"gorm.io/gorm"
)

func NewGraphHandler(e *echo.Echo, validator *validator.Validate, gorm *gorm.DB, controller *controllers.WrapController) {
	resolver := &graph.Resolver{
		AuthController:   controller.AuthController,
		UserController:   controller.UserController,
		TicketController: controller.TicketController,
	}

	config := graph.Config{
		Resolvers: resolver,
		Directives: graph.DirectiveRoot{
			Auth: directive.AuthDirective,
		},
	}
	srv := handler.New(graph.NewExecutableSchema(config))

	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	e.POST("/graphql", echo.WrapHandler(srv), middleware.BaseGraphMiddleware)
	e.GET("/playground", echo.WrapHandler(playground.Handler("playground", "/graphql")))
}
