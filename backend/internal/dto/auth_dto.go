package dto

import "time"

const HEADER_JWT_KEY = "x-acc-token"

type ClaimsJWT struct {
	Sub  int
	Role string
	Exp  time.Time
}
