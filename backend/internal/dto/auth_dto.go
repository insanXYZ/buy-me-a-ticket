package dto

import "time"

type ClaimsJWT struct {
	Sub string    `json:"sub"`
	Exp time.Time `json:"exp"`
}
