package utils

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func CreateTicketSlug(title string) string {

	title = strings.TrimSpace(title)

	dashed := strings.ReplaceAll(title, " ", "-")

	if len(dashed) >= 15 {
		dashed = dashed[:14]
	}

	return fmt.Sprintf("%v-%v", dashed, strconv.Itoa(int(time.Now().Unix())))
}
