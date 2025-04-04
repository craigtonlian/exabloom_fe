import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ActionNode from "./ActionNode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type ActionNodeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: Node | null;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
};

export default function ActionNodeSheet({
  open,
  onOpenChange,
  node,
  onLabelChange,
  onDelete,
}: ActionNodeSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[60vw] p-2">
        <SheetHeader>
          <SheetTitle>Action</SheetTitle>
          <SheetDescription>Update contact</SheetDescription>
        </SheetHeader>

        <hr className="-mx-2" />

        <div className="grid gap-6 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="actionName" className="text-right">
              Action Name
            </Label>
            <Input
              id="actionName"
              className="col-span-3"
              value="" // value={node.data?.label ?? ""}
              onChange={(e) => onLabelChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>

          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
