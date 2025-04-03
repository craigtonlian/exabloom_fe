import { Handle, Position } from '@xyflow/react';

export default function EndNode() {
    return (
        <div className="w-48 h-14 flex flex-col items-center justify-center p-2 bg-gray-200 border-2 border-gray-500 rounded-4xl">
            <div>
                <span className="text-sm text-gray-500">
                    END
                </span>
            </div>
            <Handle className="invisible" type='target' position={Position.Top} />
        </div>
    );
}
