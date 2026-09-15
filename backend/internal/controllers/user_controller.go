package controllers

import (
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/services"
	"buymeaticket-backend/internal/utils"
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

	claims, _ := utils.GetUserCtx(ctx)

	user, err := u.userService.MeHandler(ctx, claims)

	if err != nil {
		return &model.MeResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &model.MeResponse{
		Success: true,
		Message: message.SuccessMe,
		User: &model.User{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	}, nil

}
