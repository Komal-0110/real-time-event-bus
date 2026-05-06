package main

import (
	"event-bus/internal/pubsub"
	"event-bus/internal/routes"
	"log"
	"net/http"
)

func main() {
	b := pubsub.NewBroker()
	handler := routes.NewHandler(b)
	router := routes.NewRouter(handler)

	handlerWithCors := corsMiddleware(router)

	log.Println("Server running at :8080")
	http.ListenAndServe(":8080", handlerWithCors)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// handle preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
