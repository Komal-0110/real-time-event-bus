import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Radio, Users } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";

interface Message {
  Topic: string;
  Message: string;
}

export interface EventCardProps {
  topic: string;
  group: string;
}

const EventCard: FunctionComponent<EventCardProps> = ({ topic, group }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  useEffect(() => {
    const wsUri = `ws://127.0.0.1:8080/subscribe?topic=${topic}&group=${group}`;
    const websocket = new WebSocket(wsUri);
    websocket.onopen = () => {
      console.log("WebSocket connected");
      setStatus("connected");
    };

    websocket.onmessage = (event) => {
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
      if (
        websocket.readyState === WebSocket.OPEN ||
        websocket.readyState === WebSocket.CONNECTING
      ) {
        websocket.close();
      }
      setStatus("disconnected");
    };
  }, [topic, group]);

  return (
    <Card className="flex flex-col h-[450px] shadow-sm border border-slate-200 overflow-hidden bg-white hover:border-blue-300 transition-colors">
      <CardHeader className="flex-none py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50/50">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-sm font-bold text-slate-700 truncate max-w-[180px]">
              {group}
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
            {topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === "connected" ? (
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase">
                Live
              </span>
            </div>
          ) : (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0 overflow-hidden flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.length === 0 ? (
            <div className="flex flex-col h-full items-center justify-center text-slate-400 gap-2">
              <div className="p-3 bg-slate-50 rounded-full">
                <Radio className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-xs italic">Awaiting events...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="py-2.5 first:pt-0 group animate-in fade-in slide-in-from-left-2 duration-300"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold font-mono text-blue-500/70 bg-blue-50 px-1.5 py-0.5 rounded">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed break-words font-medium">
                    {msg.Message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-[10px]">
        <span className="text-slate-500 font-medium">
          Messages:
          <span className="text-slate-800 font-bold">{messages.length}</span>
        </span>
        <button
          onClick={() => setMessages([])}
          className="text-slate-400 hover:text-red-500 transition-colors font-bold uppercase tracking-tighter"
        >
          Clear Log
        </button>
      </div>
    </Card>
  );
};

export default EventCard;
