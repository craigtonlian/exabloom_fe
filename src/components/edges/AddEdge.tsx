import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EDGE_TYPES,
  NODE_HORIZONTAL_SPACING,
  NODE_LABELS,
  NODE_TYPES,
  NODE_VERTICAL_SPACING,
} from "@/constants";
import {
  type Edge,
  EdgeLabelRenderer,
  EdgeProps,
  type Node,
  StepEdge,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEditNode } from "../EditNodeContext";

export default function AddEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } =
    props;

  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const [menuOpen, setMenuOpen] = useState(false);
  const { setSelectedNode, setSheetOpen } = useEditNode();

  const onAddEdgeClick = (nodeTypeSelected: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    const sourceNode = nodes.find((n) => n.id === props.source);
    const targetNode = nodes.find((n) => n.id === props.target);
    if (!sourceNode || !targetNode) return;

    // Position new node between source and target
    const newX = targetNode.position.x;
    const newY = targetNode.position.y;

    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];
    let updatedNodes: Node[] = [];
    let updatedEdges: Edge[] = [];

    if (nodeTypeSelected === NODE_TYPES.IF_ELSE_NODE) {
      const ifElseNodeId = uuidv4();
      const branchNodeId = uuidv4();
      const elseNodeId = uuidv4();
      const branchEndNodeId = uuidv4();
      const elseEndNodeId = uuidv4();

      newNodes.push(
        // Create new If-Else Node
        {
          id: ifElseNodeId,
          type: NODE_TYPES.IF_ELSE_NODE,
          data: {
            label: NODE_LABELS.IF_ELSE_NODE,
            branches: [`${NODE_LABELS.BRANCH_NODE} #1`],
            else: NODE_LABELS.ELSE_NODE,
          },
          position: { x: newX, y: newY },
        },
        // Create new Branch Node under If-Else Node
        // Position to the left
        {
          id: branchNodeId,
          type: NODE_TYPES.BRANCH_NODE,
          data: { label: `${NODE_LABELS.BRANCH_NODE} #1` },
          position: {
            x: newX - NODE_HORIZONTAL_SPACING / 2,
            y: newY + NODE_VERTICAL_SPACING,
          },
        },
        // Create new Else Node under If-Else Node
        // Position to the right
        {
          id: elseNodeId,
          type: NODE_TYPES.ELSE_NODE,
          data: { label: NODE_LABELS.ELSE_NODE },
          position: {
            x: newX + NODE_HORIZONTAL_SPACING / 2,
            y: newY + NODE_VERTICAL_SPACING,
          },
        },
        // Create new End Node under Branch Node
        // Position to the left and lower
        {
          id: branchEndNodeId,
          type: NODE_TYPES.END_NODE,
          data: { label: NODE_LABELS.END_NODE },
          position: {
            x: newX - NODE_HORIZONTAL_SPACING / 2,
            y: newY + NODE_VERTICAL_SPACING * 2,
          },
        },
        // Create new End Node under Else Node
        // Position to the right and lower
        {
          id: elseEndNodeId,
          type: NODE_TYPES.END_NODE,
          data: { label: NODE_LABELS.END_NODE },
          position: {
            x: newX + NODE_HORIZONTAL_SPACING / 2,
            y: newY + NODE_VERTICAL_SPACING * 2,
          },
        }
      );

      // Move target node and below nodes downward to avoid overlap
      updatedNodes = nodes.map((n) => {
        if (n.position.y > newY || n.id === targetNode.id) {
          return {
            ...n,
            position: {
              ...n.position,
              y: n.position.y + NODE_VERTICAL_SPACING * 3, // Leave space for the new nodes
            },
          };
        }

        return n;
      });

      newEdges.push(
        // Create new edge from Source Node to If-Else Node
        {
          id: `${sourceNode.id}_${ifElseNodeId}`,
          source: sourceNode.id,
          target: ifElseNodeId,
          type: EDGE_TYPES.ADD_EDGE,
        },
        // Create new edge from If-Else Node to Branch Node
        {
          id: `${ifElseNodeId}_${branchNodeId}`,
          source: ifElseNodeId,
          target: branchNodeId,
          type: EDGE_TYPES.NORMAL_EDGE,
        },
        // Create new edge from If-Else Node to Else Node
        {
          id: `${ifElseNodeId}_${elseNodeId}`,
          source: ifElseNodeId,
          target: elseNodeId,
          type: EDGE_TYPES.NORMAL_EDGE,
        },
        // Create new edge from Branch Node to End Node
        {
          id: `${branchNodeId}_${branchEndNodeId}`,
          source: branchNodeId,
          target: branchEndNodeId,
          type: EDGE_TYPES.ADD_EDGE,
        },
        // Create new edge from Else Node to End Node
        {
          id: `${elseNodeId}_${elseEndNodeId}`,
          source: elseNodeId,
          target: elseEndNodeId,
          type: EDGE_TYPES.ADD_EDGE,
        }
      );

      // If targetNode is not an END_NODE, connect branch end to it instead of creating a new end node
      if (targetNode.type !== NODE_TYPES.END_NODE) {
        // Remove edge from branchNode to branchEndNode
        newEdges = newEdges.filter(
          (e: Edge) => e.id !== `${branchNodeId}_${branchEndNodeId}`
        );

        // Remove branchEndNode
        newNodes = newNodes.filter((n: Node) => n.id !== branchEndNodeId);

        // Connect Branch Node to targetNode directly
        newEdges.push({
          id: `${branchNodeId}_${targetNode.id}`,
          source: branchNodeId,
          target: targetNode.id,
          type: EDGE_TYPES.ADD_EDGE,
        });

        // Compute new X position and offset
        const newTargetX = newX - NODE_HORIZONTAL_SPACING / 2;
        const xOffset = newTargetX - targetNode.position.x;

        // Run BFS to find all nodes to shift: target node + all its descendants
        const visited = new Set<string>();
        const queue = [targetNode.id];

        while (queue.length > 0) {
          const currentId = queue.shift()!;
          visited.add(currentId);

          // Find children of current node (outgoing edges)
          const children = edges
            .filter((e) => e.source === currentId)
            .map((e) => e.target);

          for (const childId of children) {
            if (!visited.has(childId)) {
              queue.push(childId);
            }
          }
        }

        // Shift target and its descendents to be under Branch node
        updatedNodes = updatedNodes.map((n) => {
          if (visited.has(n.id)) {
            return {
              ...n,
              position: {
                ...n.position,
                x: n.position.x + xOffset,
              },
            };
          }
          return n;
        });
      } else {
        // Remove targetNode
        updatedNodes = updatedNodes.filter((n: Node) => n.id !== targetNode.id);
      }
    } else if (nodeTypeSelected === NODE_TYPES.ACTION_NODE) {
      const actionNodeId = uuidv4();
      newNodes.push({
        id: actionNodeId,
        type: NODE_TYPES.ACTION_NODE,
        data: { label: NODE_LABELS.ACTION_NODE },
        position: { x: newX, y: newY },
      });

      // Move target node and below nodes downward to avoid overlap
      updatedNodes = nodes.map((n) => {
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
      newEdges.push(
        // Create new edge from Source Node to Action Node
        {
          id: `${sourceNode.id}_${actionNodeId}`,
          source: sourceNode.id,
          target: actionNodeId,
          type: EDGE_TYPES.ADD_EDGE,
        },
        // Create new edge from Action Node to Target Node
        {
          id: `${actionNodeId}_${targetNode.id}`,
          source: actionNodeId,
          target: targetNode.id,
          type: EDGE_TYPES.ADD_EDGE,
        }
      );
    }

    // Remove the existing edge
    updatedEdges = edges.filter(
      (e: Edge) => !(e.source === sourceNode.id && e.target === targetNode.id)
    );

    setNodes([...updatedNodes, ...newNodes]);
    setEdges([...updatedEdges, ...newEdges]);

    setSelectedNode(newNodes[0]);
    setSheetOpen(true);
  };

  const [_, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <StepEdge {...props} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className="nodrag nopan cursor-pointer disable:auto-focus"
                onClick={() => setMenuOpen(true)}
              >
                <Plus size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-24"
              align="start"
              side="right"
              onCloseAutoFocus={(e) => e.preventDefault()}
              onFocusOutside={(_) => setMenuOpen(false)}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onAddEdgeClick(NODE_TYPES.ACTION_NODE)}
                >
                  {NODE_LABELS.ACTION_NODE}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAddEdgeClick(NODE_TYPES.IF_ELSE_NODE)}
                >
                  {NODE_LABELS.IF_ELSE_NODE}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
