package pubsub

import (
	"event-bus/internal/models"
	"sync"
)

type Topic struct {
	Name   string
	Groups map[string][]Subscriber
	Index  map[string]int
	mu     sync.RWMutex
}

func NewTopic(name string) *Topic {
	return &Topic{
		Name:   name,
		Groups: make(map[string][]Subscriber),
		Index:  make(map[string]int),
	}
}

func (t *Topic) AddSubscriber(subscriber Subscriber) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.Groups == nil {
		t.Groups = make(map[string][]Subscriber)
	}

	if t.Index == nil {
		t.Index = make(map[string]int)
	}

	t.Groups[subscriber.Group] = append(t.Groups[subscriber.Group], subscriber)
}

func (t *Topic) RemoveSubscriber(subscriberID string) {
	t.mu.Lock()
	defer t.mu.Unlock()

	for group, subscribers := range t.Groups {
		for i, subscriber := range subscribers {
			if subscriber.ID == subscriberID {
				t.Groups[group] = append(subscribers[:i], subscribers[i+1:]...)
				break
			}
		}
	}
}

func (t *Topic) Publish(message string) {
	t.mu.RLock()
	defer t.mu.RUnlock()

	for group, subscribers := range t.Groups {
		if len(subscribers) == 0 {
			continue
		}

		idx := t.Index[group] % len(subscribers)
		subscriber := subscribers[idx]

		msg := models.Message{
			Topic:   t.Name,
			Message: message,
		}

		select {
		case subscriber.Channel <- msg:
		default:
			println("Subscriber slow, skipping:", subscriber.ID)

		}

		t.Index[group] = (t.Index[group] + 1) % len(subscribers)
	}
}
