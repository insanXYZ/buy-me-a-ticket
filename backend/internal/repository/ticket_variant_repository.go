package repository

import (
	"buymeaticket-backend/internal/entity"
	"context"

	"gorm.io/gorm"
)

type TicketVariantRepository struct {
	Repository[entity.TicketVariant]
}

func NewTicketVariantRepository(db *gorm.DB) *TicketVariantRepository {
	return &TicketVariantRepository{
		Repository[entity.TicketVariant]{
			db: db,
		},
	}
}

func (t *TicketVariantRepository) WithTx(tx *gorm.DB) *TicketVariantRepository {
	return NewTicketVariantRepository(tx)
}

func (t *TicketVariantRepository) FindByTicketID(ctx context.Context, ticketID int) ([]entity.TicketVariant, error) {
	var dst []entity.TicketVariant

	err := t.db.WithContext(ctx).Where("ticket_id = ?", ticketID).Find(&dst).Error

	return dst, err
}

func (t *TicketVariantRepository) PluckIDByTicketID(ctx context.Context, ticketID int) ([]int, error) {
	var dst []int

	err := t.db.WithContext(ctx).Model(&entity.TicketVariant{}).Where("ticket_id = ?", ticketID).Pluck("id", &dst).Error
	return dst, err
}

