package utils

import "golang.org/x/crypto/bcrypt"

const COST = 10

func EncryptPassword(password string) (string, error) {

	var crypted string

	b, err := bcrypt.GenerateFromPassword([]byte(password), COST)
	if err != nil {
		return crypted, err
	}

	return string(b), nil
}

func BindingPassword(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}
