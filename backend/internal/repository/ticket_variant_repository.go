package repository

import (
	"buymeaticket-backend/internal/entity"

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
