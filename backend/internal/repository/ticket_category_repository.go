package repository

import (
	"buymeaticket-backend/internal/entity"
	"context"

	"gorm.io/gorm"
)

type TicketCategoryRepository struct {
	Repository[entity.TicketCategory]
}

func NewTicketCategoryRepository(db *gorm.DB) *TicketCategoryRepository {
	return &TicketCategoryRepository{
		Repository[entity.TicketCategory]{
			db: db,
		},
	}
}

func (t *TicketCategoryRepository) WithTx(tx *gorm.DB) *TicketCategoryRepository {
	return NewTicketCategoryRepository(tx)
}

func (t *TicketCategoryRepository) TakeByName(ctx context.Context, name string) (*entity.TicketCategory, error) {
	dst := new(entity.TicketCategory)
	err := t.db.WithContext(ctx).Take(dst, "name = ?", name).Error
	return dst, err
}
