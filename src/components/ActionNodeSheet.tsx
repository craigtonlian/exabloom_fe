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

type ActionNodeData = {
  actionName?: string;
};

type ActionNodeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: (Node & { data?: ActionNodeData }) | null;
  handleActionNameChange: (label: string) => void;
  onDeleteActionNode: () => void;
};

export default function ActionNodeSheet({
  open,
  onOpenChange,
  node,
  handleActionNameChange,
  onDeleteActionNode,
}: ActionNodeSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[30vw]">
        <SheetHeader>
          <SheetTitle>Action</SheetTitle>
          <SheetDescription>Update contact</SheetDescription>
        </SheetHeader>

        <hr />

        <div className="px-4">
          <Label htmlFor="actionName" className="pb-3">
            Action Name
          </Label>
          <Input
            id="actionName"
            value={node?.data?.actionName ?? ""}
            onChange={(e) => handleActionNameChange(e.target.value)}
          />

          <div className="flex items-center space-x-2 mt-10">
            <Label className="pb-3">+ Add field</Label>
          </div>
        </div>

        <SheetFooter className="mt-auto">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="bg-rose-100 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white"
              onClick={onDeleteActionNode}
            >
              Delete
            </Button>

            <div className="space-x-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                className="bg-violet-700 text-white hover:bg-violet-800"
                onClick={() => onOpenChange(false)}
              >
                Save
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
