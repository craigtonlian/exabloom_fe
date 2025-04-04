import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Node } from "@xyflow/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

type ActionNodeData = {
  actionName?: string;
};

type ActionNodeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: (Node & { data?: ActionNodeData }) | null;
  onActionNameChange: (label: string) => void;
  onDeleteActionNode: () => void;
};

export default function ActionNodeSheet({
  open,
  onOpenChange,
  node,
  onActionNameChange,
  onDeleteActionNode,
}: ActionNodeSheetProps) {
  const [actionName, setActionName] = useState(node?.data?.actionName ?? "");

  useEffect(() => {
    setActionName(node?.data?.actionName ?? "");
  }, [node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onActionNameChange(actionName);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[30vw]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Action</SheetTitle>
          <SheetDescription>Update contact</SheetDescription>
        </SheetHeader>

        <hr className="-mt-3 mb-2" />

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="px-4">
            <Label htmlFor="actionName" className="pb-3">
              Action Name
            </Label>
            <Input
              id="actionName"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
            />

            <div className="flex items-center space-x-2 mt-10">
              <Label className="pb-3">+ Add field</Label>
            </div>
          </div>

          <SheetFooter className="mt-auto">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                className="bg-rose-100 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white"
                onClick={onDeleteActionNode}
              >
                Delete
              </Button>

              <div className="space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-700 text-white hover:bg-violet-800"
                >
                  Save
                </Button>
              </div>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
