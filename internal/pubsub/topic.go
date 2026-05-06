package pubsub

import (
	"event-bus/internal/models"
	"sync"
)

type Topic struct {
	Name        string
	Subscribers map[string]Subscriber
	mu          sync.RWMutex
}

func NewTopic(name string) *Topic {
	return &Topic{
		Name:        name,
		Subscribers: make(map[string]Subscriber),
	}
}

func (t *Topic) AddSubscriber(subscriber Subscriber) {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.Subscribers[subscriber.ID] = subscriber
}

func (t *Topic) RemoveSubscriber(subscriberID string) {
	t.mu.Lock()
	defer t.mu.Unlock()
	delete(t.Subscribers, subscriberID)
}

func (t *Topic) Publish(message string) {
	t.mu.RLock()
	defer t.mu.RUnlock()
	for _, subscriber := range t.Subscribers {
		subscriber.Channel <- models.Message{
			Topic:   t.Name,
			Message: message,
		}
	}
}
