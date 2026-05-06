package pubsub

import "event-bus/internal/models"

type Subscriber struct {
	ID      string
	Group   string
	Channel chan models.Message
}
