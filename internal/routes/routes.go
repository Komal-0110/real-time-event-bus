package routes

import "net/http"

type Route struct {
	Method  string
	Path    string
	Handler http.HandlerFunc
}

func GetRoutes(h *Handler) []Route {
	return []Route{
		{
			Method:  http.MethodPost,
			Path:    "/publish",
			Handler: h.PublishHandler,
		},
		{
			Method:  http.MethodGet,
			Path:    "/subscribe",
			Handler: h.SubscribeHandler,
		},
	}
}

func NewRouter(h *Handler) http.Handler {
	mux := http.NewServeMux()

	for _, route := range GetRoutes(h) {
		mux.HandleFunc(route.Path, methodHandler(route.Method, route.Handler))
	}

	return mux
}

func methodHandler(method string, handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != method {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		handler(w, r)
	}
}
