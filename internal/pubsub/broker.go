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
		b.Topics[name] = NewTopic(name)
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

func (b *Broker) Publish(topicName string, message string) {
	b.mu.RLock()
	topic, exists := b.Topics[topicName]
	b.mu.RUnlock()

	if exists {
		topic.Publish(message)
	}
}
