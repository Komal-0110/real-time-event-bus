package pubsub

import (
	"sync"
)

type Broker struct {
	Topics map[string]*Topic
	mu     sync.RWMutex
}

func NewBroker() *Broker {
	return &Broker{
		Topics: make(map[string]*Topic),
	}
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

func (b *Broker) Publish(topicName string, message string) {
	b.mu.RLock()
	topic, exists := b.Topics[topicName]
	b.mu.RUnlock()

	if !exists {
		return
	}

	topic.Publish(message)
}
