package routes

import (
	"encoding/json"
	"event-bus/internal/models"
	"event-bus/internal/pubsub"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Handler struct {
	broker *pubsub.Broker
}

func NewHandler(broker *pubsub.Broker) *Handler {
	return &Handler{
		broker: broker,
	}
}

func (h *Handler) PublishHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Topic   string `json:"topic"`
		Payload string `json:"payload"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	h.broker.Publish(req.Topic, req.Payload)
	w.WriteHeader(http.StatusOK)
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	Conn *websocket.Conn
}

type AckMessage struct {
	Type      string `json:"type"`
	MessageID string `json:"message_id"`
}

func (h *Handler) SubscribeHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	topic := r.URL.Query().Get("topic")
	group := r.URL.Query().Get("group")

	subscriber := pubsub.Subscriber{
		ID:      conn.RemoteAddr().String(),
		Group:   group,
		Channel: make(chan models.Message, 10),
	}

	client := &Client{
		Conn: conn,
	}

	go func() {
		client.readPump(h.broker, subscriber)
		h.broker.Unsubscribe(topic, subscriber.ID)
	}()
	go client.writePump(subscriber.Channel)

	h.broker.CreateTopic(topic)
	h.broker.Subscribe(topic, subscriber)
}

func (c *Client) readPump(b *pubsub.Broker, subscriber pubsub.Subscriber) {
	defer c.Conn.Close()

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var ack AckMessage

		if err := json.Unmarshal(msg, &ack); err != nil {
			continue
		}

		if ack.Type == "ack" {
			b.Ack(ack.MessageID, subscriber.ID)
		}

		log.Println("Received from client:", string(msg))
	}
}

func (c *Client) writePump(ch chan models.Message) {
	defer c.Conn.Close()

	for msg := range ch {
		if err := c.Conn.WriteJSON(msg); err != nil {
			log.Println("Error writing message:", err)
			break
		}
	}
}
