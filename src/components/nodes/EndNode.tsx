import { NODE_LABELS } from "@/constants";
import { Handle, Position } from "@xyflow/react";

export default function EndNode() {
  return (
    <div className="w-48 h-14 flex flex-col items-center justify-center p-2 bg-zinc-100 border-2 border-neutral-400 rounded-4xl nodrag">
      <div>
        <span className="text-xs text-neutral-400">{NODE_LABELS.END_NODE}</span>
      </div>
      <Handle className="invisible" type="target" position={Position.Top} />
    </div>
  );
}
