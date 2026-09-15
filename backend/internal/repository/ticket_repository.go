package repository

import (
	"buymeaticket-backend/internal/entity"
	"context"
	"fmt"

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

func (t *TicketRepository) TakeByIDWithUserID(ctx context.Context, ticketID, userID int) (*entity.Ticket, error) {
	dst := new(entity.Ticket)

	err := t.db.Where("id = ? AND user_id = ?", ticketID, userID).Take(dst).Error

	return dst, err
}

func (t *TicketRepository) FindWithAllRelation(ctx context.Context) ([]entity.Ticket, error) {
	var dst []entity.Ticket
	err := t.db.WithContext(ctx).Preload("User").Preload("TicketDetail").Preload("TicketCategory").Preload("TicketVariants").Find(&dst).Error

	return dst, err
}

func (t *TicketRepository) TakeBySlugWithAllRelation(ctx context.Context, slug string) (entity.Ticket, error) {
	var dst entity.Ticket
	err := t.db.WithContext(ctx).Preload("User").Preload("TicketDetail").Preload("TicketCategory").Preload("TicketVariants").Take(&dst, "slug = ?", slug).Error

	return dst, err
}

func (t *TicketRepository) SearchNameWithAllRelation(ctx context.Context, search string) ([]entity.Ticket, error) {
	var dst []entity.Ticket
	err := t.db.WithContext(ctx).Preload("User").Preload("TicketDetail").Preload("TicketCategory").Preload("TicketVariants").Find(&dst, "ticket_details.title LIKE ?", fmt.Sprintf("%%%v%%", search)).Error

	return dst, err
}
