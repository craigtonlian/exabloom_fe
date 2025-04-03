import { Handle, Position } from '@xyflow/react';

export default function ActionNode() {
    return (
        <div
            style={{ display: 'flex' }}
            className="p-4 bg-gray-100 rounded-md"
            onClick={() => {
                console.log('Action Node clicked');
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid blue', background: '#e0ffe0' }}>
                <img src="/assets/comment.png" alt="Icon" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid red', background: '#eee000' }}>
                <span style={{ fontSize: 'small', color: 'green' }}>
                    Action Node
                </span>
            </div>
            <Handle type='source' position={Position.Bottom} />
            <Handle type='target' position={Position.Top} />
        </div>
    );
}
