package pubsub

import (
	"event-bus/internal/models"
	"time"
)

type PendingMessage struct {
	Message    models.Message
	Subscriber *Subscriber
	RetryCount int
	LastSentAt time.Time
}
