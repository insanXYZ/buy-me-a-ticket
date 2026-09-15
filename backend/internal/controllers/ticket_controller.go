package controllers

import (
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/services"
	"buymeaticket-backend/internal/utils"
	"context"
)

type TicketController struct {
	ticketService *services.TicketService
}

func NewTicketController(ticketService *services.TicketService) *TicketController {
	return &TicketController{
		ticketService: ticketService,
	}
}

func (t *TicketController) CreateTicketCategory(ctx context.Context, input model.CreateTicketCategoryInput) (*model.CreateTicketCategoryResponse, error) {
	err := t.ticketService.CreateTicketCategoryHandler(ctx, &input)
	if err != nil {
		return &model.CreateTicketCategoryResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.CreateTicketCategoryResponse{
		Status:  true,
		Message: message.SuccessCreateTicketCategory,
	}, nil
}

func (t *TicketController) UpdateTicketCategory(ctx context.Context, input model.UpdateTicketCategoryInput, ticketCategoryID int) (*model.UpdateTicketCategoryResponse, error) {
	err := t.ticketService.UpdateTicketCategoryHandler(ctx, &input, ticketCategoryID)
	if err != nil {
		return &model.UpdateTicketCategoryResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.UpdateTicketCategoryResponse{
		Status:  true,
		Message: message.SuccessUpdateTicketCategory,
	}, nil
}

func (t *TicketController) DeleteTicketCategory(ctx context.Context, ticketCategoryID int) (*model.DeleteTicketCategoryResponse, error) {
	err := t.ticketService.DeleteTicketCategoryHandler(ctx, ticketCategoryID)
	if err != nil {
		return &model.DeleteTicketCategoryResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.DeleteTicketCategoryResponse{
		Status:  true,
		Message: message.SuccessDeleteTicketCategory,
	}, nil
}

func (t *TicketController) CreateTicket(ctx context.Context, input model.CreateTicketInput) (*model.CreateTicketResponse, error) {
	claims, err := utils.GetUserCtx(ctx)
	if err != nil {
		return &model.CreateTicketResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	err = t.ticketService.CreateTicketHandler(ctx, claims, &input)
	if err != nil {
		return &model.CreateTicketResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.CreateTicketResponse{
		Status:  true,
		Message: message.SuccessCreateTicket,
	}, nil
}

func (t *TicketController) UpdateTicket(ctx context.Context, input model.UpdateTicketInput, ticketID int) (*model.UpdateTicketResponse, error) {
	claims, err := utils.GetUserCtx(ctx)
	if err != nil {
		return &model.UpdateTicketResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	err = t.ticketService.UpdateTicketHandler(ctx, claims, ticketID, &input)
	if err != nil {
		return &model.UpdateTicketResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.UpdateTicketResponse{
		Status:  true,
		Message: message.SuccessUpdateTicket,
	}, nil
}

func (t *TicketController) DeleteTicket(ctx context.Context, ticketID int) (*model.DeleteTicketResponse, error) {
	claims, err := utils.GetUserCtx(ctx)
	if err != nil {
		return &model.DeleteTicketResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	err = t.ticketService.DeleteTicketHandler(ctx, claims, ticketID)
	if err != nil {
		return &model.DeleteTicketResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.DeleteTicketResponse{
		Status:  true,
		Message: message.SuccessDeleteTicket,
	}, nil
}

func (t *TicketController) Tickets(ctx context.Context) ([]*model.Ticket, error) {
	tickets, err := t.ticketService.RetrieveTicketsHandler(ctx)
	if err != nil {
		return nil, err
	}

	resTickets := make([]*model.Ticket, len(tickets))

	for i, ticket := range tickets {
		modelTicket := &model.Ticket{
			ID: ticket.ID,
			CategoryTicket: &model.TicketCategory{
				ID:   ticket.CategoryTicketID,
				Name: ticket.TicketCategory.Name,
			},
			Organizer: &model.User{
				ID:    ticket.User.ID,
				Name:  ticket.User.Name,
				Email: ticket.User.Email,
				Role:  ticket.User.Role,
			},
			TicketDetail: &model.TicketDetail{
				ID:               ticket.TicketDetail.ID,
				Title:            ticket.TicketDetail.Title,
				Slug:             ticket.TicketDetail.Slug,
				Description:      ticket.TicketDetail.Description,
				Location:         ticket.TicketDetail.Location,
				EventDate:        ticket.TicketDetail.EventDate,
				EventStartTime:   ticket.TicketDetail.EventStartTime,
				EventEndTime:     ticket.TicketDetail.EventEndTime,
				TermAndCondition: ticket.TicketDetail.TermAndCondition,
			},
		}

		for _, variant := range ticket.TicketVariants {
			modelTicket.TicketVariants = append(modelTicket.TicketVariants, &model.TicketVariant{
				ID:     variant.ID,
				Name:   variant.Name,
				Price:  variant.Price,
				Perks:  variant.Perks,
				Quota:  variant.Quota,
				Active: variant.Active,
			})
		}

		resTickets[i] = modelTicket
	}

	return resTickets, nil
}

func (t *TicketController) Ticket(ctx context.Context, slug string) (*model.Ticket, error) {
	ticket, err := t.ticketService.RetrieveTicketWithSlugHandler(ctx, slug)
	if err != nil {
		return nil, err
	}

	modelTicket := &model.Ticket{
		ID: ticket.ID,
		CategoryTicket: &model.TicketCategory{
			ID:   ticket.CategoryTicketID,
			Name: ticket.TicketCategory.Name,
		},
		Organizer: &model.User{
			ID:    ticket.User.ID,
			Name:  ticket.User.Name,
			Email: ticket.User.Email,
			Role:  ticket.User.Role,
		},
		TicketDetail: &model.TicketDetail{
			ID:               ticket.TicketDetail.ID,
			Title:            ticket.TicketDetail.Title,
			Slug:             ticket.TicketDetail.Slug,
			Description:      ticket.TicketDetail.Description,
			Location:         ticket.TicketDetail.Location,
			EventDate:        ticket.TicketDetail.EventDate,
			EventStartTime:   ticket.TicketDetail.EventStartTime,
			EventEndTime:     ticket.TicketDetail.EventEndTime,
			TermAndCondition: ticket.TicketDetail.TermAndCondition,
		},
	}

	for _, variant := range ticket.TicketVariants {
		modelTicket.TicketVariants = append(modelTicket.TicketVariants, &model.TicketVariant{
			ID:     variant.ID,
			Name:   variant.Name,
			Price:  variant.Price,
			Perks:  variant.Perks,
			Quota:  variant.Quota,
			Active: variant.Active,
		})
	}

	return modelTicket, nil
}

func (t *TicketController) TicketSearch(ctx context.Context, search string) ([]*model.Ticket, error) {
	tickets, err := t.ticketService.SerachTicketsHandler(ctx, search)
	if err != nil {
		return nil, err
	}

	resTickets := make([]*model.Ticket, len(tickets))

	for i, ticket := range tickets {
		modelTicket := &model.Ticket{
			ID: ticket.ID,
			CategoryTicket: &model.TicketCategory{
				ID:   ticket.CategoryTicketID,
				Name: ticket.TicketCategory.Name,
			},
			Organizer: &model.User{
				ID:    ticket.User.ID,
				Name:  ticket.User.Name,
				Email: ticket.User.Email,
				Role:  ticket.User.Role,
			},
			TicketDetail: &model.TicketDetail{
				ID:               ticket.TicketDetail.ID,
				Title:            ticket.TicketDetail.Title,
				Slug:             ticket.TicketDetail.Slug,
				Description:      ticket.TicketDetail.Description,
				Location:         ticket.TicketDetail.Location,
				EventDate:        ticket.TicketDetail.EventDate,
				EventStartTime:   ticket.TicketDetail.EventStartTime,
				EventEndTime:     ticket.TicketDetail.EventEndTime,
				TermAndCondition: ticket.TicketDetail.TermAndCondition,
			},
		}

		for _, variant := range ticket.TicketVariants {
			modelTicket.TicketVariants = append(modelTicket.TicketVariants, &model.TicketVariant{
				ID:     variant.ID,
				Name:   variant.Name,
				Price:  variant.Price,
				Perks:  variant.Perks,
				Quota:  variant.Quota,
				Active: variant.Active,
			})
		}

		resTickets[i] = modelTicket
	}

	return resTickets, nil
}
