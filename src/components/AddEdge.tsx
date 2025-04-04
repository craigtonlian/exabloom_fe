import {
  type Node,
  type Edge,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlow,
  getBezierPath,
  BezierEdge,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NODE_VERTICAL_SPACING } from "@/constants";

export default function AddEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const onAddEdgeClick = () => {
    const nodes = getNodes();
    const edges = getEdges();
    const sourceNode = nodes.find((n) => n.id === props.source);
    const targetNode = nodes.find((n) => n.id === props.target);

    if (!sourceNode) {
      console.error(`Source node not found: ${props.source}`);
      return;
    }
    if (!targetNode) {
      console.error(`Target node not found: ${props.target}`);
      return;
    }

    const newNodeId = `node-${+new Date()}`;

    // Position new node between source and target
    const newX = targetNode.position.x; //(sourceNode.position.x + targetNode.position.x) / 2;
    const newY = targetNode.position.y; // (sourceNode.position.y + targetNode.position.y) / 2;

    const newNode: Node = {
      id: newNodeId,
      type: "actionNode",
      data: { actionName: "Action Node" },
      position: { x: newX, y: newY },
    };

    // Move target + below nodes downward to avoid overlap
    const updatedNodes = nodes.map((n) => {
      if (n.position.y > newY || n.id === targetNode.id) {
        return {
          ...n,
          position: {
            ...n.position,
            y: n.position.y + NODE_VERTICAL_SPACING,
          },
        };
      }
      return n;
    });

    // Remove the old edge, insert two new ones
    const filteredEdges = edges.filter(
      (e: Edge) => !(e.source === sourceNode.id && e.target === targetNode.id)
    );
    const newEdges = [
      {
        id: `${sourceNode.id}-${newNodeId}`,
        source: sourceNode.id,
        target: newNodeId,
        type: "addEdge",
      },
      {
        id: `${newNodeId}-${targetNode.id}`,
        source: newNodeId,
        target: targetNode.id,
        type: "addEdge",
      },
    ];

    setNodes([...updatedNodes, newNode]);
    setEdges([...filteredEdges, ...newEdges]);
  };

  const [_, labelX, labelY] = getBezierPath({
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
          className="nodrag nopan cursor-pointer"
          onClick={onAddEdgeClick}
        >
          <Plus size={16} />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
}
