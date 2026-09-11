package repository

import (
	"buymeaticket-backend/internal/entity"

	"gorm.io/gorm"
)

type TicketRepository struct {
	Repository[entity.Ticket]
}

func NewTicketRepository(db *gorm.DB) *TicketRepository {
	return &TicketRepository{
		Repository[entity.Ticket]{
			db: db,
		},
	}
}

func (t *TicketRepository) WithTx(tx *gorm.DB) *TicketRepository {
	return NewTicketRepository(tx)
}
