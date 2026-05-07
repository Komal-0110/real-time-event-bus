import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, SendHorizontal, Tag } from "lucide-react";
import { FunctionComponent, useState } from "react";

export interface PublishFormProps {
  topic: string;
  onPublish: (topic: string, message: string) => void;
}

const PublishForm: FunctionComponent<PublishFormProps> = ({
  topic,
  onPublish,
}) => {
  const [message, setMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (message.trim()) {
      setIsPublishing(true);
      try {
        await onPublish(topic, message);
        setMessage("");
      } finally {
        setIsPublishing(false);
      }
    }
  };

  return (
    <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm ring-1 ring-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SendHorizontal className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-l font-bold text-slate-800">
              Publish Event To {topic}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Broadcast a message to your subscribers
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Message Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 ml-1">
            <MessageSquare className="w-4 h-4" />
            <label>Message Payload</label>
          </div>
          <Textarea
            placeholder="Enter JSON or plain text..."
            className="min-h-[120px] resize-none bg-white border-slate-200 focus:ring-purple-500 p-4 leading-relaxed transition-all"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Button
          onClick={handlePublish}
          className={`w-full h-12 text-base font-bold shadow-md transition-all active:scale-[0.98] ${
            isPublishing
              ? "bg-slate-100 text-slate-400"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          }`}
          disabled={!topic || !message.trim() || isPublishing}
        >
          {isPublishing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Deploy Message
              <SendHorizontal className="w-4 h-4" />
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PublishForm;
