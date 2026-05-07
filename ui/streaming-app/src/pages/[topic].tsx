import GroupsSelector, { SelectedGroupItem } from "@/stream/groupsSelector";
import PublishForm from "@/stream/publishForm";
import ShowEventCards from "@/stream/showEventCards";
import { Users } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";

const TopicPage: React.FC = () => {
  const router = useRouter();
  const { topic, groups } = router.query;
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroupItem[]>([]);

  if (
    typeof topic !== "string" ||
    !topic ||
    !groups ||
    !Array.isArray(groups)
  ) {
    return <div className="p-4">Invalid topic or groups</div>;
  }

  const handlePublish = async (topic: string, message: string) => {
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
    } catch (error) {
      console.error("Error publishing message:", error);
    }
  };

  //   const handleGroupSelector = (group: string) => {
  //     setSelectedGroups((prev) => [...prev, group]);
  //   };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
      <aside className="w-full lg:w-80 xl:w-96 border-r bg-white p-6 flex flex-col gap-8 shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <div className="h-6 w-1 bg-blue-600 rounded-full" />
            {topic}
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase mt-1 tracking-wider">
            Stream Management
          </p>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
          {/* Selection Tool */}
          <section className="space-y-3">
            <GroupsSelector
              groups={groups}
              selectedGroups={selectedGroups}
              onSelectGroups={setSelectedGroups}
            />
          </section>

          <div className="h-px bg-slate-100 w-full" />

          {/* Action Tool */}
          <section className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Broadcast Message
              </label>
              <PublishForm topic={topic} onPublish={handlePublish} />
            </div>
          </section>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>Status: Online</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Server
            </span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-8">
        {selectedGroups.length > 0 ? (
          <ShowEventCards topic={topic} groups={selectedGroups} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
              <Users className="w-12 h-12 text-slate-200 mx-auto" />
              <h2 className="mt-4 text-slate-800 font-semibold">
                No Groups Selected
              </h2>
              <p className="text-sm text-slate-500 max-w-[250px] mx-auto mt-1">
                Select one or more groups from the left panel to begin streaming
                events.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TopicPage;
