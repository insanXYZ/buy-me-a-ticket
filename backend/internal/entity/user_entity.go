package entity

import (
	"database/sql"
	"time"
)

type User struct {
	ID        string       `gorm:"primaryKey"`
	Name      string       `gorm:"column:name"`
	Email     string       `gorm:"column:email"`
	Password  string       `gorm:"column:password"`
	Role      string       `gorm:"column:role"`
	CreatedAt time.Time    `gorm:"column:created_at"`
	UpdatedAt time.Time    `gorm:"column:updated_at"`
	LastLogin sql.NullTime `gorm:"column:last_login"`
}

func (User) TableName() string {
	return "users"
}
