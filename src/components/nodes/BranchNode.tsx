import { NODE_LABELS } from "@/constants";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

type BranchNode = Node<{ label: string }, "label">;

export default function BranchNode({ data }: NodeProps<BranchNode>) {
  return (
    <div className="w-48 h-14 flex flex-col items-center justify-center p-2 bg-zinc-100 border-2 border-neutral-400 rounded-4xl nodrag">
      <div>
        <span className="text-xs text-neutral-400">
          {data.label ?? NODE_LABELS.BRANCH_NODE}
        </span>
      </div>
      <Handle className="invisible" type="target" position={Position.Top} />
      <Handle className="invisible" type="source" position={Position.Bottom} />
    </div>
  );
}
