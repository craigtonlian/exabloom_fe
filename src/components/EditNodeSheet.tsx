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
import { NODE_TYPES } from "@/constants";
import { BranchNode, EditableNode, ElseNode } from "@/types/nodes";
import { useReactFlow } from "@xyflow/react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type EditNodeSheetProps = {
  node: EditableNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLabelChange: (label: string) => void;
  onDelete: () => void;
  onBranchesChange: (branchNodes: BranchNode[]) => void;
  onElseChange: (
    elseNode: ElseNode,
    branchCount: number,
    isBranchesChanged: boolean
  ) => void;
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
  const [branchNodes, setBranchNodes] = useState<BranchNode[]>();
  const [initialBranchNodes, setInitialBranchNodes] = useState<BranchNode[]>();
  const [elseNode, setElseNode] = useState<ElseNode>();

  const { getNodes } = useReactFlow();

  useEffect(() => {
    if (!node) return;
    setLabel(node.data?.label ?? "");

    if (node?.type === NODE_TYPES.IF_ELSE_NODE) {
      const nodes = getNodes();
      const initialBranches = (node.data.branches ?? [])
        .map((branchId) => {
          const branchNode = nodes.find((n) => n.id === branchId);
          return branchNode;
        })
        .filter((n): n is BranchNode => !!n);
      setBranchNodes(initialBranches);
      setInitialBranchNodes(initialBranches);

      const foundElseNode = nodes.find(
        (n) => n.id === node.data.else && n.type === NODE_TYPES.ELSE_NODE
      );

      if (foundElseNode) {
        setElseNode(foundElseNode as ElseNode);
      }
    }
  }, [node]);

  const branchesUpdated = () => {
    if (!branchNodes || !initialBranchNodes) return false;
    if (branchNodes.length !== initialBranchNodes.length) return true;

    return branchNodes.some((b, i) => {
      const initial = initialBranchNodes[i];
      return b.id !== initial.id || b.data.label !== initial.data.label;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      alert("Node label cannot be empty!");
      return;
    }

    onLabelChange(label);

    if (node?.type === NODE_TYPES.IF_ELSE_NODE) {
      const shouldUpdateBranches = !!branchNodes && branchesUpdated();

      if (shouldUpdateBranches) {
        onBranchesChange(branchNodes);
      }

      if (elseNode) {
        onElseChange(elseNode, branchNodes?.length ?? 0, shouldUpdateBranches);
      }
    }

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[40vw]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Edit</SheetTitle>
          <SheetDescription>
            {node?.type === NODE_TYPES.ACTION_NODE
              ? "Edit Action Node"
              : "Edit If-Else Node"}
          </SheetDescription>
        </SheetHeader>

        <hr className="-mt-3 mb-2" />

        {node?.type === NODE_TYPES.ACTION_NODE ? (
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => console.log("Add field clicked!")}
                >
                  + Add field
                </Button>
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
        ) : node?.type === NODE_TYPES.IF_ELSE_NODE ? (
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
                  {branchNodes?.map((branchNode, index) => (
                    <div
                      key={branchNode.id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Input
                        value={branchNode.data.label}
                        onChange={(e) => {
                          const updated = [...branchNodes];
                          updated[index] = {
                            ...branchNode,
                            data: { ...branchNode.data, label: e.target.value },
                          };
                          setBranchNodes(updated);
                        }}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          if (branchNodes.length === 1) {
                            alert("Cannot delete the last branch!");
                            return;
                          }
                          setBranchNodes(
                            branchNodes.filter((_, i) => i !== index)
                          );
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
                      setBranchNodes([
                        ...(branchNodes ?? []),
                        {
                          id: uuidv4(),
                          type: NODE_TYPES.BRANCH_NODE,
                          data: {
                            label: `Branch #${(branchNodes?.length ?? 0) + 1}`,
                          },
                          position: { x: 100, y: 100 },
                        },
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
                  value={elseNode?.data.label ?? ""}
                  onChange={(e) => {
                    if (elseNode) {
                      setElseNode({
                        ...elseNode,
                        data: { ...elseNode.data, label: e.target.value },
                      });
                    }
                  }}
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
