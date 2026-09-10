package dto

import "time"

const HEADER_JWT_KEY = "x-acc-token"

type ClaimsJWT struct {
	Sub  string
	Role string
	Exp  time.Time
}
