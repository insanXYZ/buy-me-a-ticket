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
		"role": claims.Role,
		"sub":  claims.Sub,
	})

	return token.SignedString(secret)

}

func ParsingJWT(token string) (*dto.ClaimsJWT, error) {
	parsed, err := jwt.Parse(token, func(t *jwt.Token) (any, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	claims := parsed.Claims.(jwt.MapClaims)

	return &dto.ClaimsJWT{
		Sub:  claims["sub"].(int),
		Role: claims["role"].(string),
	}, nil
}
