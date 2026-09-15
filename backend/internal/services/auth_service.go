package services

import (
	"buymeaticket-backend/internal/dto"
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/entity"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/repository"
	"buymeaticket-backend/internal/utils"
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type AuthService struct {
	userRepository *repository.UserRepository
	validator      *validator.Validate
}

func NewAuthService(validator *validator.Validate, userRepository *repository.UserRepository) *AuthService {
	return &AuthService{
		userRepository: userRepository,
		validator:      validator,
	}
}

func (a *AuthService) LoginHandler(ctx context.Context, input *model.LoginInput) (string, error) {

	var token string
	err := a.validator.Struct(input)
	if err != nil {
		return token, err
	}

	err = a.userRepository.Tx(ctx, func(tx *gorm.DB) error {

		txUserRepo := a.userRepository.WithTx(ctx, tx)

		user, err := txUserRepo.TakeByEmail(ctx, input.Email)
		if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		if utils.BindingPassword(input.Password, user.Password) != nil {
			return errors.New("err")
		}

		user.LastLogin = sql.NullTime{
			Time: time.Now(),
		}

		err = txUserRepo.UpdateById(ctx, user.ID, user)
		if err != nil {
			return err
		}

		claims := dto.ClaimsJWT{
			Role: user.Role,
			Sub:  user.ID,
		}

		token, err = utils.JWT.SignedLogin(claims)
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return token, errors.New(message.ErrLogin)
	}

	return token, nil
}

func (a *AuthService) RegisterHandler(ctx context.Context, input *model.RegisterInput) error {
	err := a.validator.Struct(input)
	if err != nil {
		return err
	}

	_, err = a.userRepository.TakeByEmail(ctx, input.Email)

	if err == nil {
		return errors.New(message.ErrEmailRegistered)
	}

	passwordCrypt, err := utils.EncryptPassword(input.Password)
	if err != nil {
		return errors.New(message.ErrEncryptedPassword)
	}

	newUser := &entity.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: passwordCrypt,
		Role:     string(input.Role),
	}

	err = a.userRepository.Create(ctx, newUser)

	return err
}
