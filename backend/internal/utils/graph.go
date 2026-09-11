package utils

import (
	"buymeaticket-backend/internal/dto"
	"context"
	"errors"
	"net/http"
)

func GetUserCtx(ctx context.Context) (*dto.ClaimsJWT, error) {
	v, ok := ctx.Value("user").(*dto.ClaimsJWT)
	if !ok {
		return nil, errors.New("Unauthorized")
	}

	return v, nil
}

func GetWriterRespCtx(ctx context.Context) (http.ResponseWriter, error) {
	v, ok := ctx.Value("writer").(http.ResponseWriter)
	if !ok {
		return nil, errors.New("Server was error")
	}
	return v, nil
}
