package repository

import (
	"buymeaticket-backend/internal/entity"

	"gorm.io/gorm"
)

type TicketRepository struct {
	Repository[entity.Ticket]
	db *gorm.DB
}

func NewTicketRepository(db *gorm.DB) *TicketRepository {
	return &TicketRepository{
		db: db,
		Repository: Repository[entity.Ticket]{
			db: db,
		},
	}
}
