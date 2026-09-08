package controllers

import (
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/services"
	"context"
)

type AuthController struct {
	authService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{
		authService: authService,
	}
}

func (a *AuthController) Login(ctx context.Context, input *model.LoginInput) (*model.LoginResponse, error) {
	token, err := a.authService.LoginHandler(ctx, input)

	if err != nil {
		return &model.LoginResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &model.LoginResponse{
		Message: message.SuccLogin,
		Token:   &token,
		Success: true,
	}, nil
}

func (a *AuthController) Register(ctx context.Context, input *model.RegisterInput) (*model.RegisterResponse, error) {
	err := a.authService.RegisterHandler(ctx, input)
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
