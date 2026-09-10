package services

import (
	"buymeaticket-backend/internal/dto"
	"buymeaticket-backend/internal/entity"
	"buymeaticket-backend/internal/repository"
	"context"

	"github.com/go-playground/validator/v10"
)

type UserService struct {
	validator      *validator.Validate
	userRepository *repository.UserRepository
}

func NewUserService(validator *validator.Validate, userRepository *repository.UserRepository) *UserService {
	return &UserService{
		validator:      validator,
		userRepository: userRepository,
	}
}

func (u *UserService) MeHandler(ctx context.Context, claims dto.ClaimsJWT) (*entity.User, error) {
	id := claims.Sub

	return u.userRepository.TakeByID(ctx, id)
}
