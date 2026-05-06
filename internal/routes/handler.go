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
		Message string `json:"message"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	h.broker.Publish(req.Topic, req.Message)
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

func (h *Handler) SubscribeHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	topic := r.URL.Query().Get("topic")

	subscriber := pubsub.Subscriber{
		ID:      conn.LocalAddr().String(),
		Channel: make(chan models.Message, 10),
	}

	client := &Client{
		Conn: conn,
	}

	go client.readPump()
	go client.writePump(subscriber.Channel)

	h.broker.CreateTopic(topic)
	h.broker.Subscribe(topic, subscriber)
}

func (c *Client) readPump() {
	defer c.Conn.Close()

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
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
