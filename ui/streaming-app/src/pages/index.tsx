import AddTopic from "@/stream/addTopic";
import GroupTable from "@/stream/groupTable";
import TopicList from "@/stream/topicList";
import { Hash } from "lucide-react";
import { useState } from "react";

export interface Topic {
  name: string;
  groups: string[];
}

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopic, setActiveTopic] = useState<Topic>();

  const handlePublish = async (topic: string, message: string) => {
    console.log(`Publishing to ${topic}: ${message}`);

    try {
      const response = await fetch(`http://127.0.0.1:8080/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Topic: topic,
          Message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to publish: ${response.statusText}`);
      }

      console.log("Message published successfully!");
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  };

  const handleDeleteTopic = (topicToDelete: Topic) => {
    setTopics((prev) => {
      const newList = prev.filter((t) => t.name !== topicToDelete.name);
      if (activeTopic?.name === topicToDelete.name) {
        setActiveTopic(newList[0] || undefined);
      }
      return newList;
    });
  };

  const handleUpdateTopic = (oldName: string, newName: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.name === oldName ? { ...t, name: newName } : t)),
    );
    if (activeTopic?.name === oldName) {
      setActiveTopic({ ...activeTopic, name: newName });
    }
  };

  const handleUpdateGroup = (oldName: string, newName: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.name === activeTopic?.name) {
          return {
            ...t,
            groups: t.groups.map((g) => (g === oldName ? newName : g)),
          };
        }
        return t;
      }),
    );
  };

  const handleDeleteGroup = (name: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.name === activeTopic?.name) {
          return {
            ...t,
            groups: t.groups.filter((g) => g !== name),
          };
        }
        return t;
      }),
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <div className="w-full border-b bg-white p-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <AddTopic onAdd={(t) => setTopics((prev) => [...prev, t])} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        <div className="w-1/3 flex flex-col min-w-[300px] max-w-[400px]">
          <div className="mb-3 px-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Your Topics
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TopicList
              topics={topics}
              activeTopic={activeTopic}
              onSelect={setActiveTopic}
              onUpdate={handleUpdateTopic}
              onDelete={handleDeleteTopic}
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {activeTopic ? (
            <div className="flex-1 overflow-y-auto p-4">
              <GroupTable
                activeTopic={activeTopic}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="p-4 bg-slate-50 rounded-full">
                <Hash className="w-8 h-8 text-slate-300" />
              </div>
              <p>Select a topic to view and manage groups</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
