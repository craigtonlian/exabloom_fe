import {
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

  const onAddEdgeClick = () => {
    window.alert(`AddEdge has been clicked!`);
  };

  // const { setEdges, setNodes } = useReactFlow();

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
