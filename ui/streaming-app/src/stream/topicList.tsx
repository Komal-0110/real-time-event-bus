import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Topic } from "@/pages";
import {
  Check,
  ChevronRight,
  Layers,
  Pencil,
  Radio,
  Trash2,
  X,
} from "lucide-react";
import { FunctionComponent, useState } from "react";

export interface TopicListProps {
  topics: Topic[];
  activeTopic: Topic | undefined;
  onSelect: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
  onUpdate: (oldName: string, newName: string) => void;
}

const TopicList: FunctionComponent<TopicListProps> = ({
  topics,
  activeTopic,
  onSelect,
  onDelete,
  onUpdate,
}) => {
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (e: React.MouseEvent, topic: string) => {
    e.stopPropagation();
    setEditingTopic(topic);
    setEditValue(topic);
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editValue.trim() && editingTopic) {
      onUpdate(editingTopic, editValue.trim());
    }
    setEditingTopic(null);
  };

  return (
    <Card className="flex flex-col h-full shadow-lg border-none ring-1 ring-slate-200 overflow-hidden bg-white">
      <CardHeader className="flex-none px-4 py-4 border-b bg-slate-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
            <Layers className="w-4 h-4 text-blue-500" />
            TOPICS
          </CardTitle>
          <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {topics.length}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {topics.map((topic) => {
            const isActive = topic.name === activeTopic?.name;
            const isEditing = editingTopic === topic.name;

            return (
              <li
                key={topic.name}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer
                  ${isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                onClick={() => !isEditing && onSelect(topic)}
              >
                {isEditing ? (
                  <div className="flex items-center gap-1 w-full">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-7 text-xs text-black py-0 px-2 focus-visible:ring-blue-400"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1 hover:text-green-400"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingTopic(null)}
                      className="p-1 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="truncate max-w-[120px] font-medium">
                      {topic.name}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEditing(e, topic.name)}
                        className={`p-1 rounded hover:bg-white/20 ${isActive ? "text-white" : "text-slate-400 hover:text-blue-500"}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(topic);
                        }}
                        className={`p-1 rounded hover:bg-white/20 ${isActive ? "text-white" : "text-slate-400 hover:text-red-500"}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopicList;
