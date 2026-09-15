package controllers

type WrapController struct {
	AuthController   *AuthController
	TicketController *TicketController
	UserController   *UserController
}
