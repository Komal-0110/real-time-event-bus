import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Topic } from "@/pages";
import { Check, Edit2, Radio, Trash2, Users, X } from "lucide-react";
import Link from "next/link";
import { FunctionComponent, useState } from "react";

export interface GroupTableProps {
  activeTopic: Topic | undefined;
  onUpdateGroup: (oldName: string, newName: string) => void;
  onDeleteGroup: (name: string) => void;
}

const GroupTable: FunctionComponent<GroupTableProps> = ({
  activeTopic,
  onUpdateGroup,
  onDeleteGroup,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const handleSave = (oldName: string) => {
    if (editValue.trim() && editValue !== oldName) {
      onUpdateGroup(oldName, editValue.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Groups for {activeTopic ? activeTopic.name : "Select a topic"}
        </h2>
        {activeTopic && (
          <Link
            href={{
              pathname: `/${activeTopic.name}`,
              query: { groups: activeTopic.groups },
            }}
            className="hover:bg-blue-50 text-blue-600 gap-2 px-3 py-1 text-sm flex items-center"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            Stream Event
          </Link>
        )}
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeTopic?.groups.map((groupName, index) => (
              <TableRow
                key={groupName}
                className="group transition-colors hover:bg-slate-50/50"
              >
                <TableCell className="text-slate-400 font-mono text-xs">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-full max-w-[200px]"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Users className="w-4 h-4 text-slate-400" />
                      {groupName}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingIndex === index ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-600"
                          onClick={() => handleSave(groupName)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400"
                          onClick={() => setEditingIndex(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          onClick={() => startEditing(index, groupName)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          onClick={() => onDeleteGroup(groupName)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {activeTopic?.groups.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-slate-400"
                >
                  No groups added to this topic yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default GroupTable;
