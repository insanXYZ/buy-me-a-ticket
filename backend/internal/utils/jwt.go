package utils

import (
	"buymeaticket-backend/internal/dto"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var JWT jwtUtil

func init() {
	JWT = jwtUtil{
		loginExp: 24 * time.Hour,
	}
}

type jwtUtil struct {
	loginExp time.Duration
}

func (j jwtUtil) SignedLogin(claims dto.ClaimsJWT) (string, error) {
	secret := []byte(os.Getenv("JWT_SECRET"))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":  j.loginExp,
		"role": claims.Role,
		"sub":  claims.Sub,
	})

	return token.SignedString(secret)

}

func (jwtUtil) Parsing(token string) (*dto.ClaimsJWT, error) {
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
