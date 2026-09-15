package middleware

import (
	"buymeaticket-backend/internal/dto"
	"buymeaticket-backend/internal/utils"
	"context"

	"github.com/labstack/echo/v5"
)

func BaseGraphMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		ctx := context.WithValue(c.Request().Context(), "writer", c.Response())
		c.SetRequest(c.Request().WithContext(ctx))

		cookie, err := c.Cookie(dto.HEADER_JWT_KEY)
		if err != nil {
			return next(c)
		}

		parsed, err := utils.JWT.Parsing(cookie.Value)
		if err != nil {
			return next(c)
		}

		ctx = context.WithValue(c.Request().Context(), "user", parsed)
		c.SetRequest(c.Request().WithContext(ctx))

		return next(c)
	}
}
