import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FunctionComponent, useEffect, useState } from "react";

interface Message {
  Topic: string;
  Message: string;
}

export interface EventCardProps {
  topic: string;
}

const EventCard: FunctionComponent<EventCardProps> = ({ topic }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  useEffect(() => {
    setMessages([]);

    const wsUri = `ws://127.0.0.1:8080/subscribe?topic=${topic}`;
    const websocket = new WebSocket(wsUri);
    websocket.onopen = () => {
      console.log("WebSocket connected");
      setStatus("connected");
    };

    websocket.onmessage = (event) => {
      console.log("Received message:", event.data);
      try {
        const msg: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("disconnected");
    };

    websocket.onclose = () => {
      console.log("WebSocket closed");
      setStatus("disconnected");
    };

    return () => {
      websocket.close();
      setMessages([]);
      setStatus("disconnected");
    };
  }, [topic]);

  return (
    <Card className="flex flex-col h-full shadow-md border-2 border-slate-200 overflow-hidden">
      <CardHeader className="flex-none flex flex-row items-center justify-between border-b bg-slate-50/50 py-4 px-6">
        <div className="font-bold text-lg uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <div className="h-4 w-1 bg-blue-500 rounded-full" /> Stream:
          {topic || "No Topic Selected"}
        </div>
        <div className="flex items-center gap-2">
          {status === "connected" ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1.5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Connected
            </Badge>
          ) : status === "connecting" ? (
            <Badge
              variant="outline"
              className="text-amber-500 border-amber-500 animate-pulse"
            >
              Connecting...
            </Badge>
          ) : (
            <Badge variant="destructive">Disconnected</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-3">
        <div className="h-full w-full overflow-y-auto rounded-lg bg-slate-950 p-4 font-mono shadow-inner border border-slate-800">
          {messages.length === 0 ? (
            <div className="text-slate-500 animate-pulse flex h-full items-center justify-center text-center">
              <p>
                No Messages Yet... <br />
                <span className="text-xs">
                  Waiting for events on topic <strong>{topic}</strong>
                </span>
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className="text-sm border-l-2 border-slate-700 pl-4 py-0.5 hover:border-blue-500 transition-colors"
                >
                  <span className="text-slate-500 text-xs mr-3 font-sans">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="text-emerald-400 break-all">
                    {msg.Message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
