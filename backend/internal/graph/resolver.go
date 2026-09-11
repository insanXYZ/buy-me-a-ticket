package graph

import "buymeaticket-backend/internal/controllers"

type Resolver struct {
	*controllers.AuthController
	*controllers.UserController
	*controllers.TicketController
}

func (r *Resolver) Mutation() MutationResolver { return r }

func (r *Resolver) Query() QueryResolver { return r }
