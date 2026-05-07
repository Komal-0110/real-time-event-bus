package pubsub

import (
	"event-bus/internal/models"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
)

const (
	RetryTimeout  = 5 * time.Second
	MaxRetryCount = 3
)

type Broker struct {
	Topics          map[string]*Topic
	PendingMessages map[string]PendingMessage

	mu sync.RWMutex
}

func NewBroker() *Broker {
	b := &Broker{
		Topics:          make(map[string]*Topic),
		PendingMessages: make(map[string]PendingMessage),
	}

	go b.startRetryWorker()

	return b
}

func (b *Broker) CreateTopic(name string) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if _, exists := b.Topics[name]; !exists {
		b.Topics[name] = &Topic{
			Name:   name,
			Groups: make(map[string][]Subscriber),
			Index:  make(map[string]int),
		}
	}
}

func (b *Broker) Subscribe(topicName string, subscriber Subscriber) {
	b.mu.RLock()
	topic, exists := b.Topics[topicName]
	b.mu.RUnlock()

	if exists {
		topic.AddSubscriber(subscriber)
	}
}

func (b *Broker) Unsubscribe(topicName string, subscriberID string) {
	b.mu.RLock()
	topic, exists := b.Topics[topicName]
	b.mu.RUnlock()

	if exists {
		topic.RemoveSubscriber(subscriberID)
	}
}

func (b *Broker) Publish(topicName string, payload string) {
	b.mu.RLock()
	topic, exists := b.Topics[topicName]
	b.mu.RUnlock()

	if !exists {
		return
	}

	msg := models.Message{
		Topic:     topicName,
		ID:        uuid.NewString(),
		Payload:   payload,
		Timestamp: time.Now(),
	}

	subscriber, ok := topic.Publish(payload, msg)

	if !ok {
		return
	}

	key := msg.ID + ":" + subscriber.ID

	b.mu.Lock()
	b.PendingMessages[key] = PendingMessage{
		Message:    msg,
		Subscriber: &subscriber,
		RetryCount: 0,
		LastSentAt: time.Now(),
	}
	b.mu.Unlock()

	log.Println("Message sent:", msg.ID)
}

func (b *Broker) Ack(messageID string, subscriberID string) {
	key := messageID + ":" + subscriberID

	b.mu.Lock()
	defer b.mu.Unlock()

	delete(b.PendingMessages, key)

	log.Println("ACK received:", messageID)
}

func (b *Broker) startRetryWorker() {
	ticker := time.NewTicker(2 * time.Second)

	for range ticker.C {
		b.mu.Lock()
		for id, pending := range b.PendingMessages {
			if time.Since(pending.LastSentAt) < RetryTimeout {
				continue
			}

			if pending.RetryCount >= MaxRetryCount {
				delete(b.PendingMessages, id)
				continue
			}

			select {
			case pending.Subscriber.Channel <- pending.Message:
				pending.RetryCount++
				pending.LastSentAt = time.Now()
				log.Println("Retrying message:", pending.Message.ID)
			default:
				log.Println("Retry failed: subscriber busy")
			}
		}
		b.mu.Unlock()
	}
}
