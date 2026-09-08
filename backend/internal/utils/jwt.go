package utils

import (
	"buymeaticket-backend/internal/dto"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const LOGIN_EXP = 24 * time.Hour

func BuildJWT(claims dto.ClaimsJWT) (string, error) {

	secret := []byte(os.Getenv("JWT_SECRET"))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp": jwt.NumericDate{
			Time: claims.Exp,
		},
		"sub": claims.Sub,
	})

	return token.SignedString(secret)

}
