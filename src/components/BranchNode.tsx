import { Handle, Position } from "@xyflow/react";

export default function BranchNode() {
  return (
    <div className="w-48 h-14 flex flex-col items-center justify-center p-2 bg-zinc-100 border-2 border-neutral-400 rounded-4xl nodrag">
      <div>
        <span className="text-xs text-neutral-400">Branch Node</span>
      </div>
      <Handle className="invisible" type="target" position={Position.Top} />
    </div>
  );
}
