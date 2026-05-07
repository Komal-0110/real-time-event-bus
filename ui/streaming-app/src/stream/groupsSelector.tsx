import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface SelectedGroupItem {
  id: string;
  name: string;
}

interface GroupsSelectorProps {
  groups: string[];
  selectedGroups: SelectedGroupItem[];
  onSelectGroups: (groups: SelectedGroupItem[]) => void;
}

const GroupsSelector: React.FC<GroupsSelectorProps> = ({
  groups,
  selectedGroups = [],
  onSelectGroups,
}) => {
  const [open, setOpen] = useState(false);

  const addGroupInstance = (groupName: string) => {
    const newItem: SelectedGroupItem = {
      id: nanoid(),
      name: groupName,
    };
    onSelectGroups([...selectedGroups, newItem]);
    setOpen(false);
  };

  const removeGroupInstance = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSelectGroups(selectedGroups.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
        Selected Streams ({selectedGroups.length})
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full min-h-[40px] h-auto justify-between bg-white border-slate-200 py-2 px-3 shadow-sm"
          >
            <div className="flex flex-wrap gap-1.5 items-center max-w-[90%] text-left">
              <Users className="w-4 h-4 text-blue-500 shrink-0 mr-1" />
              {selectedGroups.length > 0 ? (
                selectedGroups.map((item) => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-100 pr-1 gap-1"
                    onClick={(e) => removeGroupInstance(e, item.id)}
                  >
                    {item.name}
                    <X className="w-3 h-3 cursor-pointer text-blue-400 hover:text-blue-600" />
                  </Badge>
                ))
              ) : (
                <span className="text-slate-400 font-normal">
                  Add group streams...
                </span>
              )}
            </div>
            <Plus className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search groups..." />
            <CommandEmpty>No groups found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {groups.map((groupName) => (
                <CommandItem
                  key={groupName}
                  onSelect={() => addGroupInstance(groupName)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className="text-slate-700">{groupName}</span>
                  <Plus className="h-3 w-3 text-slate-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GroupsSelector;
