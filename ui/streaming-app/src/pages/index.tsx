import AddTopic from "@/stream/addTopic";
import EventCard from "@/stream/eventsCard";
import PublishForm from "@/stream/publishForm";
import TopicList from "@/stream/topicList";
import { useState } from "react";

export default function Home() {
  const [topics, setTopics] = useState<string[]>([]);
  const [activeTopic, setActiveTopic] = useState<string>("");

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

  const handleDeleteTopic = (topicToDelete: string) => {
    setTopics((prev) => {
      const newList = prev.filter((t) => t !== topicToDelete);
      if (activeTopic === topicToDelete) {
        setActiveTopic(newList[0] || "");
      }
      return newList;
    });
  };

  const handleUpdateTopic = (oldName: string, newName: string) => {
    setTopics((prev) => prev.map((t) => (t === oldName ? newName : t)));
    if (activeTopic === oldName) {
      setActiveTopic(newName);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden p-5 gap-6">
      <div className="w-80 flex flex-col gap-2 ">
        <AddTopic onAdd={(t) => setTopics((prev) => [...prev, t])} />
        <TopicList
          topics={topics}
          activeTopic={activeTopic}
          onSelect={setActiveTopic}
          onUpdate={handleUpdateTopic}
          onDelete={handleDeleteTopic}
        />
      </div>

      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex-none">
          <PublishForm topics={topics} onPublish={handlePublish} />
        </div>

        <div className="flex-1 min-h-0">
          <EventCard topic={activeTopic} />
        </div>
      </div>
    </div>
  );
}
