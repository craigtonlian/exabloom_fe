import {
  type Node,
  type Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  StepEdge,
  useReactFlow,
  getBezierPath,
  BezierEdge,
  BaseEdge,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props;

  // const onAddEdgeClick = () => {
  //   window.alert(`AddEdge has been clicked!`);
  // };

  const onAddEdgeClick = () => {
    window.alert(`AddEdge has been clicked!`);

    const { getNodes, setNodes, setEdges } = useReactFlow();

    const nodes = getNodes();
    const targetNode = nodes.find((n) => n.id === props.target);

    if (!targetNode) return;

    const newNodeId = `node-${+new Date()}`;

    const newNode: Node = {
      id: newNodeId,
      type: "actionNode",
      data: { actionName: "New Action" },
      position: {
        x: targetNode.position.x,
        y: targetNode.position.y + 150,
      },
    };

    setNodes((nds) => [...nds, newNode]);

    const newEdge: Edge = {
      id: `${props.target}-${newNodeId}`,
      source: newNodeId,
      target: props.target,
      type: "addEdge",
    };

    setEdges((eds) => [...eds, newEdge]);
  };

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <Button
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onClick={onAddEdgeClick}
        >
          <Plus size={16} />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
}
