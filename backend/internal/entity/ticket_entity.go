package entity

import (
	"database/sql"
	"time"
)

type TicketCategory struct {
	ID        int          `gorm:"primaryKey;column:id"`
	Name      string       `gorm:"column:name"`
	CreatedAt time.Time    `gorm:"column:created_at"`
	UpdatedAt sql.NullTime `gorm:"column:updated_at"`
}

func (TicketCategory) TableName() string {
	return "ticket_categories"
}

type Ticket struct {
	ID               int          `gorm:"primaryKey;column:id"`
	UserID           int          `gorm:"column:user_id"`
	CategoryTicketID int          `gorm:"column:category_ticket_id"`
	CreatedAt        time.Time    `gorm:"column:created_at"`
	UpdatedAt        sql.NullTime `gorm:"column:updated_at"`

	Category TicketCategory `gorm:"foreignKey:category_ticket_id;references:id"`
	User     User           `gorm:"foreignKey:user_id;references:id"`
}

func (Ticket) TableName() string {
	return "tickets"
}

type TicketDetail struct {
	ID               int          `gorm:"primaryKey;column:id"`
	Title            string       `gorm:"column:title"`
	Slug             string       `gorm:"column:slug"`
	Description      string       `gorm:"column:description"`
	Location         string       `gorm:"column:location"`
	EventDate        string       `gorm:"column:event_date"`
	EventStartTime   string       `gorm:"column:event_start_time"`
	EventEndTime     string       `gorm:"column:event_end_time"`
	TermAndCondition string       `gorm:"column:term_and_condition"`
	CreatedAt        time.Time    `gorm:"column:created_at"`
	UpdatedAt        sql.NullTime `gorm:"column:updated_at"`
}

func (TicketDetail) TableName() string {
	return "ticket_details"
}

type TicketVariant struct {
	ID        int          `gorm:"primaryKey;column:id"`
	TicketID  int          `gorm:"column:ticket_id"`
	Name      string       `gorm:"column:name"`
	Price     int          `gorm:"column:price"`
	Perks     []string     `gorm:"column:perks"`
	Quota     int          `gorm:"column:quota"`
	Active    bool         `gorm:"column:active"`
	CreatedAt time.Time    `gorm:"column:created_at"`
	UpdatedAt sql.NullTime `gorm:"column:updated_at"`
}

func (TicketVariant) TableName() string {
	return "ticket_variants"
}
