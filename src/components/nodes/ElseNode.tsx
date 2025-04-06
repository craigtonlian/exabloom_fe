import { NODE_LABELS } from "@/constants";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type ElseNode = Node<{ label: string }, "label">;

export default function ElseNode({ data }: NodeProps<ElseNode>) {
  return (
    <div className="w-48 h-14 flex flex-col items-center justify-center p-2 bg-zinc-100 border-2 border-neutral-400 rounded-4xl nodrag">
      <div>
        <span className="text-xs text-neutral-400">
          {data.label ?? NODE_LABELS.ELSE_NODE}
        </span>
      </div>
      <Handle className="invisible" type="target" position={Position.Top} />
      <Handle className="invisible" type="source" position={Position.Bottom} />
    </div>
  );
}
