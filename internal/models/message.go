package models

import "time"

type Message struct {
	ID        string    `json:"id"`
	Topic     string    `json:"topic"`
	Payload   string    `json:"payload"`
	Timestamp time.Time `json:"timestamp"`
}
