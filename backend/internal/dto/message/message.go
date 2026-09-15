package message

const (
	ErrEmailRegistered                        = "Email has been registered"
	ErrEncryptedPassword                      = "Server was broke"
	ErrLogin                                  = "Email or password wrong"
	ErrTicketCategoryCreateNameAlreadyCreated = "Ticket category name already created"
	ErrTicketCategoryInvalid                  = "Invalid Ticket"
	ErrUpdateTicketInvalid                    = "Invalid update ticket"

	SuccessLogin                = "Login successful"
	SuccessMe                   = "Retrieve me successful"
	SuccessRegister             = "Register successful"
	SuccessCreateTicketCategory = "Create ticket category successful"
	SuccessUpdateTicketCategory = "Update ticket category successful"
	SuccessDeleteTicketCategory = "Delete ticket category successful"
	SuccessCreateTicket         = "Create ticket successful"
	SuccessUpdateTicket         = "Update ticket successful"
	SuccessDeleteTicket         = "Delete ticket successful"
)
