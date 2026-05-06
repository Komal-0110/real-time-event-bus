package pubsub

import "event-bus/internal/models"

type Subscriber struct {
	ID      string
	Channel chan models.Message
}
