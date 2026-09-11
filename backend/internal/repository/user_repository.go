package repository

import (
	"buymeaticket-backend/internal/entity"
	"context"

	"gorm.io/gorm"
)

type UserRepository struct {
	Repository[entity.User]
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		Repository[entity.User]{
			db: db,
		},
	}
}

func (u *UserRepository) TakeByEmail(ctx context.Context, email string) (*entity.User, error) {
	user := new(entity.User)

	err := u.db.Where("email = ?", email).Take(user).Error
	return user, err
}

func (u *UserRepository) WithTx(ctx context.Context, tx *gorm.DB) *UserRepository {
	return NewUserRepository(tx)
}
