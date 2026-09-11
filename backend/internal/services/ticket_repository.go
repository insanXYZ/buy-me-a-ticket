package services

import (
	"buymeaticket-backend/internal/repository"

	"github.com/go-playground/validator/v10"
)

type TicketService struct {
	validator        *validator.Validate
	ticketRepository *repository.TicketRepository
}

func NewTicketService(validator *validator.Validate, ticketRepository *repository.TicketRepository) *TicketService {
	return &TicketService{
		validator:        validator,
		ticketRepository: ticketRepository,
	}
}
