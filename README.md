# 🚀 Real-Time Event Bus

A real-time event streaming platform built in Go using WebSockets and a Pub/Sub architecture.  
It enables producers and consumers to communicate through topic-based messaging with live event delivery and a monitoring UI.

---

## 🧠 Overview

This project simulates a simplified version of modern event streaming systems like Apache Kafka.  
It provides a lightweight, real-time messaging infrastructure with a focus on learning system design concepts.

---

## ⚙️ Features

- 📡 Real-time message streaming using WebSockets
- 📨 Topic-based Publish/Subscribe system
- 🧑‍💻 Multiple subscribers per topic
- ⚡ Low-latency message delivery
- 🖥️ Interactive UI for monitoring event flow
- 🔌 Simple and extensible architecture

---

## 🏗️ Architecture

- **Broker**: Manages topics and routing
- **Topics**: Logical channels for events
- **Subscribers**: Receive messages in real-time
- **WebSocket Layer**: Pushes messages to UI

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Komal-0110/realtime-event-bus.git
cd event-bus
```

go mod tidy

**Run Backend** : go run cmd/server/main.go

---

**Run Frontend** :
cd ui/streaming-app
npm install
npm run dev
