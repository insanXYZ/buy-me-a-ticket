package services

import (
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/entity"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/repository"
	"context"
	"errors"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type TicketService struct {
	validator                *validator.Validate
	ticketRepository         *repository.TicketRepository
	ticketCategoryRepository *repository.TicketCategoryRepository
	ticketVariantRepository  *repository.TicketVariantRepository
}

func NewTicketService(validator *validator.Validate, ticketRepository *repository.TicketRepository, ticketCategoryRepository *repository.TicketCategoryRepository, ticketVariantRepository *repository.TicketVariantRepository) *TicketService {
	return &TicketService{
		validator:                validator,
		ticketRepository:         ticketRepository,
		ticketCategoryRepository: ticketCategoryRepository,
		ticketVariantRepository:  ticketVariantRepository,
	}
}

func (t *TicketService) CreateTicketCategoryHandler(ctx context.Context, input *model.CreateTicketCategoryInput) error {
	err := t.validator.Struct(input)
	if err != nil {
		return err
	}

	err = t.ticketCategoryRepository.Tx(ctx, func(tx *gorm.DB) error {
		tc := t.ticketCategoryRepository.WithTx(tx)
		_, err := tc.TakeByName(ctx, input.Name)
		if err == nil {
			return errors.New(message.ErrTicketCategoryCreateNameAlreadyCreated)
		}

		newTicketCategory := &entity.TicketCategory{
			Name: input.Name,
		}

		return tc.Create(ctx, newTicketCategory)
	})

	return err
}

// func (t *TicketService) TicketCreateHandler(claims *dto.ClaimsJWT, input *model.CreateTicketInput) error {
// 	err := t.validator.Struct(input)
// 	if err != nil {
// 		return err
// 	}
//
// }
