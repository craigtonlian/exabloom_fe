import { Handle, Position } from '@xyflow/react';

export default function StartNode() {
    return (
        <div className="w-48 h-14 flex flex-row items-center justify-left p-2 bg-gray-200 border-2 border-gray-500 rounded-xl">
            <div className="w-12 items-left justify-left bg-gray-200 border-1 border-gray-500">
                <img src="../assets/comment.png" alt="Icon" />
            </div>
            <div className="w-30 flex flex-col bg-gray-200 border-1 border-gray-500">
                <div>
                    <span className="text-sm font-bold text-green-500">
                        Start Node
                    </span>
                </div>
                <div>
                    <span className="text-sm text-gray-500">
                        Start
                    </span>
                </div>
            </div>
            <Handle className="invisible" type='source' position={Position.Bottom} />
        </div>
    );
}
