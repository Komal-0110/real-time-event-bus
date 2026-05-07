import { FunctionComponent } from "react";
import EventCard from "./eventsCard";
import { Badge } from "@/components/ui/badge";
import { SelectedGroupItem } from "./groupsSelector";

export interface ShowEventCardsProps {
  topic: string;
  groups?: SelectedGroupItem[];
}

const ShowEventCards: FunctionComponent<ShowEventCardsProps> = ({
  topic,
  groups,
}) => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Live Event Monitor
        </h1>
        <Badge variant="outline" className="bg-white shadow-sm">
          {groups?.length || 0} Active Streams
        </Badge>
      </div>

      {groups === undefined ? (
        <div className="flex items-center justify-center h-[300px] bg-white rounded-md shadow-sm border border-slate-200">
          <span className="text-sm text-slate-500">No groups selected</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups?.map((group) => (
            <EventCard key={group.name} topic={topic} group={group.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowEventCards;
