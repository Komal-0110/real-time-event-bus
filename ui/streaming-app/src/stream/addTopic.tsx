import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Topic } from "@/pages";
import { Hash, Plus, Sparkles, Users, X } from "lucide-react";
import { FunctionComponent, KeyboardEvent, useState } from "react";

export interface AddTopicProps {
  onAdd: (topic: Topic) => void;
}

const AddTopic: FunctionComponent<AddTopicProps> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [groupInput, setGroupInput] = useState("");
  const [groups, setGroups] = useState<string[]>([]);

  const addGroup = () => {
    const trimmed = groupInput.trim().toLowerCase();
    if (trimmed && !groups.includes(trimmed)) {
      setGroups([...groups, trimmed]);
      setGroupInput("");
    }
  };

  const removeGroup = (tagToRemove: string) => {
    setGroups(groups.filter((g) => g !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addGroup();
    }
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        groups: groups,
      });
      setName("");
      setGroups([]);
      setGroupInput("");
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg ring-1 ring-slate-200 bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-blue-500" />
          New Channel
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Hash className="w-4 h-4" />
          </div>
          <Input
            value={name}
            placeholder="topic-name"
            className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500 h-10 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <Input
              value={groupInput}
              placeholder="Add groups (press Enter or comma)"
              className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-500 h-10 rounded-lg"
              onChange={(e) => setGroupInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addGroup}
            />
          </div>

          {groups.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {groups.map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-100 px-2 py-1 flex items-center gap-1"
                >
                  {g}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-blue-900"
                    onClick={() => removeGroup(g)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className={`w-full h-10 font-bold transition-all active:scale-[0.97] shadow-sm ${
            !name.trim()
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
