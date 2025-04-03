import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getStraightPath,
    StepEdge,
    useReactFlow,
} from '@xyflow/react';

export default function AddEdge(props: EdgeProps) {
    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
    } = props;

    const { setEdges, setNodes } = useReactFlow();

    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <StepEdge {...props} />
            <EdgeLabelRenderer>
                <button
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    onClick={() => {
                        setNodes((nds) => [
                            ...nds,
                            {
                                id: `${nds.length + 1}`,
                                type: 'actionNode',
                                position: { x: labelX - 10 / 2, y: labelY - 10 / 2 },
                                data: { label: `Node ${nds.length + 1}` },
                            },
                        ]);
                        setEdges((eds) => [
                            ...eds,
                            { id: `${id}-99`, source: id, target: `99`, type: 'addEdge' },
                            { id: `99-${id}`, source: `99`, target: id, type: 'addEdge' },
                        ]);

                    }}
                >
                    +
                </button>
            </EdgeLabelRenderer>
        </>
    );
}