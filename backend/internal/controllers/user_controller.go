package controllers

import (
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/services"
	"context"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

func (u *UserController) Me(ctx context.Context) (*model.MeResponse, error) {
	// user , err := u.userService()
	return nil, nil
}
