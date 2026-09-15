package repository

import (
	"buymeaticket-backend/internal/entity"
	"context"

	"gorm.io/gorm"
)

type TicketDetailRepository struct {
	Repository[entity.TicketDetail]
}

func NewTicketDetailRepository(db *gorm.DB) *TicketDetailRepository {
	return &TicketDetailRepository{
		db: db,
	}
}

func (*TicketDetailRepository) WithTx(tx *gorm.DB) *TicketDetailRepository {
	return NewTicketDetailRepository(tx)
}

func (t *TicketDetailRepository) TakeByTicketID(ctx context.Context, ticketID int) (*entity.TicketDetail, error) {
	dst := new(entity.TicketDetail)

	err := t.db.WithContext(ctx).Take(dst, "ticket_id = ?", ticketID).Error
	return dst, err
}
