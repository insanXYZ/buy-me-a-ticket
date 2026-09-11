package controllers

import (
	"buymeaticket-backend/internal/dto/message"
	"buymeaticket-backend/internal/graph/model"
	"buymeaticket-backend/internal/services"
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

func (t *TicketController) TicketCategoryCreate(ctx context.Context, input model.CreateTicketCategoryInput) (*model.CreateTicketCategoryResponse, error) {
	err := t.ticketService.CreateTicketCategoryHandler(ctx, &input)
	if err != nil {
		return &model.CreateTicketCategoryResponse{
			Status:  false,
			Message: err.Error(),
		}, nil
	}

	return &model.CreateTicketCategoryResponse{
		Status:  true,
		Message: message.SuccTicketCategoryCreated,
	}, nil
}

func (t *TicketController) TicketCreate(ctx context.Context, input model.CreateTicketInput) (*model.CreateTicketResponse, error) {
	panic("not implemented") // TODO: Implement
}
func (t *TicketController) TicketUpdate(ctx context.Context, input model.UpdateTicketInput, ticketID int) (*model.UpdateTicketResponse, error) {
	panic("not implemented") // TODO: Implement
}
func (t *TicketController) TicketDelete(ctx context.Context, ticketID int) (*model.DeleteTicketResponse, error) {
	panic("not implemented") // TODO: Implement
}

func (t *TicketController) Tickets(ctx context.Context) ([]*model.Ticket, error) {
	panic("not implemented") // TODO: Implement
}

func (t *TicketController) Ticket(ctx context.Context, slug string) (*model.Ticket, error) {
	panic("not implemented") // TODO: Implement
}

func (t *TicketController) TicketSearch(ctx context.Context, slug string) (*model.Ticket, error) {
	panic("not implemented") // TODO: Implement
}
