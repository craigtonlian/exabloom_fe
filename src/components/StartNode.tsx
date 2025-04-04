import { Handle, Position } from "@xyflow/react";
import square from "../assets/square.png";

export default function StartNode() {
  return (
    <div className="w-48 h-14 p-2 flex flex-row items-center justify-left  bg-white border-2 border-neutral-100 rounded-sm">
      <div className="w-12 p-1 pr-2 items-left justify-left">
        <img src={square} alt="Icon" />
      </div>
      <div className="w-30 flex flex-col justify-center items-start">
        <div>
          <span className="text-sm font-bold text-lime-600">Start Node</span>
        </div>
        <div>
          <span className="text-sm text-black">Start</span>
        </div>
      </div>
      <Handle className="invisible" type="source" position={Position.Bottom} />
    </div>
  );
}
