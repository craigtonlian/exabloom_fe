import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CustomNode } from "@/types/nodes";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

type EditNodeSheetProps = {
  node: CustomNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
  onBranchesChange: (branches: string[]) => void;
  onElseChange: (elseValue: string) => void;
};

export default function EditNodeSheet({
  node,
  open,
  onOpenChange,
  onLabelChange,
  onDelete,
  onBranchesChange,
  onElseChange,
}: EditNodeSheetProps) {
  const [label, setLabel] = useState<string>("");
  const [branches, setBranches] = useState<string[]>([]);
  const [elseValue, setElseValue] = useState<string>("");

  useEffect(() => {
    if (!node) return;
    setLabel(node.data.label ?? "");

    if (node?.type === "ifElseNode") {
      setBranches(node.data.branches ?? []);
      setElseValue(node.data.else ?? "");
    }
  }, [node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLabelChange(label);

    if (node?.type === "ifElseNode") {
      onBranchesChange(branches);
      onElseChange(elseValue);
    }

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
          <SheetTitle>Edit</SheetTitle>
          <SheetDescription>
            {node?.type === "actionNode"
              ? "Edit Action Node"
              : "Edit If-Else Node"}
          </SheetDescription>
        </SheetHeader>

        <hr className="-mt-3 mb-2" />

        {node?.type === "actionNode" ? (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-4">
              <Label htmlFor="label" className="pb-3">
                Label
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
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
                  onClick={onDelete}
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
        ) : node?.type === "ifElseNode" ? (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="px-4">
              <Label htmlFor="label" className="pb-3">
                Label
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />

              <div className="mt-10">
                <Label className="pb-3 font-bold">Branches</Label>
                <div>
                  {branches.map((branch, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Input
                        value={branch}
                        onChange={(e) => {
                          const newBranches = [...branches];
                          newBranches[index] = e.target.value;
                          setBranches(newBranches);
                        }}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          setBranches(branches.filter((_, i) => i !== index));
                        }}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() =>
                      setBranches([
                        ...branches,
                        `Branch #${branches.length + 1}`,
                      ])
                    }
                  >
                    + Add branch
                  </Button>
                </div>
              </div>

              <div className="mt-10">
                <Label className="pb-3 font-bold">Else</Label>
                <Input
                  id="else"
                  value={elseValue}
                  onChange={(e) => setElseValue(e.target.value)}
                />
              </div>
            </div>

            <SheetFooter className="mt-auto">
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-rose-100 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white"
                  onClick={onDelete}
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
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
