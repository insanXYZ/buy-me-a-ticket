package services

import (
	"buymeaticket-backend/internal/dto"
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/entity"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/repository"
	"buymeaticket-backend/internal/utils"
	"context"
	"errors"
	"slices"

	"github.com/go-playground/validator/v10"
	"golang.org/x/text/search"
	"gorm.io/gorm"
)

type TicketService struct {
	validator                *validator.Validate
	ticketRepository         *repository.TicketRepository
	ticketCategoryRepository *repository.TicketCategoryRepository
	ticketVariantRepository  *repository.TicketVariantRepository
	ticketDetailRepository   *repository.TicketDetailRepository
}

func NewTicketService(validator *validator.Validate, ticketRepository *repository.TicketRepository, ticketCategoryRepository *repository.TicketCategoryRepository, ticketVariantRepository *repository.TicketVariantRepository, ticketDetailRepository *repository.TicketDetailRepository) *TicketService {
	return &TicketService{
		validator:                validator,
		ticketRepository:         ticketRepository,
		ticketCategoryRepository: ticketCategoryRepository,
		ticketVariantRepository:  ticketVariantRepository,
		ticketDetailRepository:   ticketDetailRepository,
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

func (t *TicketService) UpdateTicketCategoryHandler(ctx context.Context, input *model.UpdateTicketCategoryInput, ticketCategoryID int) error {
	err := t.validator.Struct(input)
	if err != nil {
		return err
	}

	err = t.ticketCategoryRepository.Tx(ctx, func(tx *gorm.DB) error {
		tc := t.ticketCategoryRepository.WithTx(tx)
		ticket, err := tc.TakeByID(ctx, ticketCategoryID)
		if err != nil {
			return errors.New(message.ErrTicketCategoryInvalid)
		}

		ticket.Name = input.Name

		return tc.Save(ctx, ticket)
	})

	return err
}

func (t *TicketService) DeleteTicketCategoryHandler(ctx context.Context, ticketCategoryID int) error {
	err := t.ticketCategoryRepository.Tx(ctx, func(tx *gorm.DB) error {
		tc := t.ticketCategoryRepository.WithTx(tx)
		_, err := tc.TakeByID(ctx, ticketCategoryID)
		if err != nil {
			return errors.New(message.ErrTicketCategoryInvalid)
		}

		return tc.DeleteByID(ctx, ticketCategoryID)
	})

	return err
}

func (t *TicketService) CreateTicketHandler(ctx context.Context, claims *dto.ClaimsJWT, input *model.CreateTicketInput) error {
	err := t.validator.Struct(input)
	if err != nil {
		return err
	}

	err = t.ticketRepository.Tx(ctx, func(tx *gorm.DB) error {
		tc := t.ticketCategoryRepository.WithTx(tx)
		tt := t.ticketRepository.WithTx(tx)

		_, err := tc.TakeByID(ctx, input.CategoryID)
		if err != nil {
			return err
		}

		ticketDetail := input.TicketDetail
		ticketVariants := input.TicketVariants

		newTicketVariants := make([]entity.TicketVariant, len(ticketVariants))

		for i, v := range ticketVariants {
			newTicketVariants[i] = entity.TicketVariant{
				Name:   v.Name,
				Price:  v.Price,
				Perks:  v.Perks,
				Quota:  v.Quota,
				Active: v.Active,
			}
		}

		newTicketDetail := &entity.TicketDetail{
			Title:            ticketDetail.Title,
			Description:      ticketDetail.Description,
			TermAndCondition: ticketDetail.TermAndCondition,
			LineUps:          ticketDetail.LineUps,
			Location:         ticketDetail.Location,
			EventDate:        ticketDetail.EventDate,
			EventStartTime:   ticketDetail.EventStartTime,
			EventEndTime:     ticketDetail.EventEndTime,
			Slug:             utils.CreateTicketSlug(ticketDetail.Title),
		}

		newTicket := &entity.Ticket{
			UserID:           claims.Sub,
			CategoryTicketID: input.CategoryID,
			TicketDetail:     newTicketDetail,
			TicketVariants:   newTicketVariants,
		}

		return tt.Create(ctx, newTicket)
	})
	return err
}

func (t *TicketService) UpdateTicketHandler(ctx context.Context, claims *dto.ClaimsJWT, ticketID int, input *model.UpdateTicketInput) error {
	err := t.validator.Struct(input)
	if err != nil {
		return err
	}

	err = t.ticketRepository.Tx(ctx, func(tx *gorm.DB) error {

		tr := t.ticketRepository.WithTx(tx)
		tcr := t.ticketCategoryRepository.WithTx(tx)
		tvr := t.ticketVariantRepository.WithTx(tx)
		tdr := t.ticketDetailRepository.WithTx(tx)

		ticket, err := tr.TakeByIDWithUserID(ctx, ticketID, claims.Sub)
		if err != nil {
			return err
		}

		ticketDetail, err := tdr.TakeByTicketID(ctx, ticketID)
		if err != nil {
			return err
		}

		inputTicketDetail := input.TicketDetail

		updateTicketDetail := &entity.TicketDetail{
			ID:               ticketDetail.ID,
			Title:            inputTicketDetail.Title,
			Description:      inputTicketDetail.Description,
			Location:         inputTicketDetail.Location,
			LineUps:          inputTicketDetail.LineUps,
			EventDate:        inputTicketDetail.EventDate,
			EventStartTime:   inputTicketDetail.EventStartTime,
			EventEndTime:     inputTicketDetail.EventEndTime,
			TermAndCondition: inputTicketDetail.TermAndCondition,
			Slug:             utils.CreateTicketSlug(inputTicketDetail.Title),
		}

		err = tdr.Save(ctx, updateTicketDetail)
		if err != nil {
			return err
		}

		if ticket.CategoryTicketID != input.CategoryID {
			_, err := tcr.TakeByID(ctx, input.CategoryID)
			if err != nil {
				return err
			}
		}

		variantIDs, err := tvr.PluckIDByTicketID(ctx, ticket.ID)
		if err != nil {
			return err
		}

		var updateTicketVariants []entity.TicketVariant

		for _, v := range input.TicketVariants {
			if v.ID == nil {
				updateTicketVariants = append(updateTicketVariants, entity.TicketVariant{
					ID:       0,
					TicketID: ticketID,
					Name:     v.Name,
					Price:    v.Price,
					Perks:    v.Perks,
					Quota:    v.Quota,
					Active:   v.Active,
				})
				continue
			}

			if idx := slices.Index(variantIDs, *v.ID); idx != -1 {
				variantIDs = append(variantIDs[:idx], variantIDs[idx+1:]...)

				updateTicketVariants = append(updateTicketVariants, entity.TicketVariant{
					ID:       *v.ID,
					TicketID: ticketID,
					Name:     v.Name,
					Price:    v.Price,
					Perks:    v.Perks,
					Quota:    v.Quota,
					Active:   v.Active,
				})
			} else {
				return errors.New(message.ErrUpdateTicketInvalid)
			}
		}

		err = tvr.Save(ctx, updateTicketVariants)
		if err != nil {
			return err
		}

		if len(variantIDs) != 0 {
			if err := tvr.DeleteByIDs(ctx, variantIDs); err != nil {
				return err
			}
		}

		return nil
	})

	return err
}

func (t *TicketService) DeleteTicketHandler(ctx context.Context, claims *dto.ClaimsJWT, ticketID int) error {

	return t.ticketRepository.Tx(ctx, func(tx *gorm.DB) error {

		tr := t.ticketRepository.WithTx(tx)
		ticket, err := tr.TakeByIDWithUserID(ctx, ticketID, claims.Sub)
		if err != nil {
			return err
		}

		return tr.DeleteByID(ctx, ticket.ID)
	})

}

func (t *TicketService) RetrieveTicketsHandler(ctx context.Context) ([]entity.Ticket, error) {
	return t.ticketRepository.FindWithAllRelation(ctx)
}

func (t *TicketService) RetrieveTicketWithSlugHandler(ctx context.Context, slug string) (entity.Ticket, error) {
	return t.ticketRepository.TakeBySlugWithAllRelation(ctx, slug)
}

func (t *TicketService) SerachTicketsHandler(ctx context.Context, search string) ([]entity.Ticket , error) {
	return t.ticketRepository.SearchNameWithAllRelation(ctx , search)
}
