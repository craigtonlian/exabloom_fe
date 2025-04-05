import type { Node, NodeProps } from "@xyflow/react";

import { NODE_LABELS } from "@/constants";
import { Handle, Position } from "@xyflow/react";
import ifElseIcon from "../../assets/ifElse.png";

type IfElseNode = Node<{ label: string }, "label">;

export default function IfElseNode({ data }: NodeProps<IfElseNode>) {
  return (
    <div className="w-48 h-14 p-2 flex flex-row items-center justify-left bg-white border-2 border-neutral-100 rounded-sm nodrag cursor-pointer">
      <div className="w-12 p-1 pr-2 items-left justify-left">
        <img src={ifElseIcon} alt="Icon" />
      </div>
      <div className="w-30 flex flex-col justify-center items-start">
        <div>
          <p className="text-xs text-black truncate max-w-[125px]">
            {data.label ?? NODE_LABELS.IF_ELSE_NODE}
          </p>
        </div>
      </div>
      <Handle className="invisible" type="source" position={Position.Bottom} />
      <Handle className="invisible" type="target" position={Position.Top} />
    </div>
  );
}
