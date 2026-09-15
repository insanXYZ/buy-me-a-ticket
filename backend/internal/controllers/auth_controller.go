package controllers

import (
	"buymeaticket-backend/internal/dto"
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/services"
	"buymeaticket-backend/internal/utils"
	"context"
	"net/http"
)

type AuthController struct {
	authService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{
		authService: authService,
	}
}

func (a *AuthController) Login(ctx context.Context, input model.LoginInput) (*model.LoginResponse, error) {
	writer, err := utils.GetWriterRespCtx(ctx)
	if err != nil {
		return nil, err
	}

	token, err := a.authService.LoginHandler(ctx, &input)

	if err != nil {
		return &model.LoginResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	cookie := new(http.Cookie)
	cookie.Value = token
	cookie.Name = dto.HEADER_JWT_KEY
	cookie.HttpOnly = true
	cookie.Path = "/"

	http.SetCookie(writer, cookie)

	return &model.LoginResponse{
		Message: message.SuccessLogin,
		Token:   &token,
		Success: true,
	}, nil
}

func (a *AuthController) Register(ctx context.Context, input model.RegisterInput) (*model.RegisterResponse, error) {
	err := a.authService.RegisterHandler(ctx, &input)
	if err != nil {
		return &model.RegisterResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &model.RegisterResponse{
		Success: true,
		Message: "Success register",
	}, nil
}
