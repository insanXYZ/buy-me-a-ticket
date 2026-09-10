package utils

import (
	"buymeaticket-backend/internal/dto"
	"context"
	"net/http"
)

func GetUserCtx(ctx context.Context) (*dto.ClaimsJWT, bool) {
	v, ok := ctx.Value("user").(*dto.ClaimsJWT)
	return v, ok
}

func GetWriterRespCtx(ctx context.Context) (http.ResponseWriter, bool) {
	v, ok := ctx.Value("writer").(http.ResponseWriter)
	return v, ok
}
