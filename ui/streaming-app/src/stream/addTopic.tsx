import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hash, Plus, Sparkles } from "lucide-react";
import { FunctionComponent, useState } from "react";

export interface AddTopicProps {
  onAdd: (topic: string) => void;
}

const AddTopic: FunctionComponent<AddTopicProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
      setInputValue("");
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg ring-1 ring-slate-200 bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-blue-500" />
            New Channel
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        <div className="relative group">
          {/* Icon prefix for the input */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Hash className="w-4 h-4" />
          </div>
          <Input
            value={inputValue}
            placeholder="topic-name"
            className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500 h-10 transition-all rounded-lg"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className={`w-full h-10 font-bold transition-all active:scale-[0.97] shadow-sm ${
            !inputValue.trim()
              ? "bg-slate-100 text-slate-400"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
          Create Topic
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddTopic;
