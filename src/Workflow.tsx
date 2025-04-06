import {
  EDGE_TYPES,
  EDITABLE_NODES,
  NODE_HORIZONTAL_SPACING,
  NODE_LABELS,
  NODE_TYPES,
  NODE_VERTICAL_SPACING,
} from "@/constants";
import type {
  BranchNode as BranchNodeType,
  ElseNode as ElseNodeType,
} from "@/types/nodes";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  type Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddEdge from "./components/edges/AddEdge";
import NormalEdge from "./components/edges/NormalEdge";
import EditNodeSheet from "./components/EditNodeSheet";
import ActionNode from "./components/nodes/ActionNode";
import BranchNode from "./components/nodes/BranchNode";
import ElseNode from "./components/nodes/ElseNode";
import EndNode from "./components/nodes/EndNode";
import IfElseNode from "./components/nodes/IfElseNode";
import StartNode from "./components/nodes/StartNode";
import { getDescendantsBFS } from "./lib/utils";
import { EditableNode } from "./types/nodes";

const initialEdges: Edge[] = [
  {
    id: uuidv4(),
    source: "1",
    target: "2",
    type: EDGE_TYPES.ADD_EDGE,
  },
];

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Start Node" },
    position: { x: 300, y: 300 },
    type: NODE_TYPES.START_NODE,
  },
  {
    id: "2",
    data: { label: "End Node" },
    position: { x: 300, y: 450 },
    type: NODE_TYPES.END_NODE,
  },
];

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const nodeTypes = {
    [NODE_TYPES.START_NODE]: StartNode,
    [NODE_TYPES.END_NODE]: EndNode,
    [NODE_TYPES.ACTION_NODE]: ActionNode,
    [NODE_TYPES.IF_ELSE_NODE]: IfElseNode,
    [NODE_TYPES.BRANCH_NODE]: BranchNode,
    [NODE_TYPES.ELSE_NODE]: ElseNode,
  };

  const edgeTypes = {
    [EDGE_TYPES.NORMAL_EDGE]: NormalEdge,
    [EDGE_TYPES.ADD_EDGE]: AddEdge,
  };

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node?.type && EDITABLE_NODES.includes(node.type)) {
      setSelectedNode(node);
      setSheetOpen(true);
    }
  }, []);

  const handleLabelChange = (newLabel: string) => {
    setNodes((ns) =>
      ns.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, label: newLabel } }
          : n
      )
    );
  };

  const handleBranchesChange = (newBranchNodes: BranchNodeType[]) => {
    if (!selectedNode) return;

    console.log("handleBranchesChange called!");
    console.log("newBranchNodes", newBranchNodes);

    const descendantIds = getDescendantsBFS(selectedNode.id, edges);
    const newEndNodes: Node[] = [];

    setNodes((ns) => {
      const filteredNodes = ns.filter(
        (n) => n.id === selectedNode.id || !descendantIds.has(n.id)
      );

      const baseX = selectedNode.position.x;
      const baseY = selectedNode.position.y;

      const newNodes: Node[] = newBranchNodes.flatMap((branch, index) => {
        const branchNode: Node = {
          id: branch.id,
          type: NODE_TYPES.BRANCH_NODE,
          data: { label: branch.data.label || `Branch #${index + 1}` },
          position: {
            x:
              baseX +
              (index - newBranchNodes.length / 2) * NODE_HORIZONTAL_SPACING,
            y: baseY + NODE_VERTICAL_SPACING,
          },
        };

        const endNode: Node = {
          id: uuidv4(),
          type: NODE_TYPES.END_NODE,
          data: { label: NODE_LABELS.END_NODE },
          position: {
            x: branchNode.position.x,
            y: branchNode.position.y + NODE_VERTICAL_SPACING,
          },
        };
        newEndNodes.push(endNode);

        return [branchNode, endNode];
      });

      // Update the selectedNode's branch IDs
      const updatedNodes = filteredNodes.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                branches: newNodes
                  .filter((node) => node.type === NODE_TYPES.BRANCH_NODE)
                  .map((b) => b.id),
              },
            }
          : n
      );

      return [...updatedNodes, ...newNodes];
    });

    setEdges((es) => {
      const filteredEdges = es.filter(
        (e) =>
          e.target === selectedNode.id ||
          (!descendantIds.has(e.target) && e.source !== selectedNode.id)
      );

      const newEdges: Edge[] = newBranchNodes.flatMap((b, index) => {
        const branchNodeId = b.id;
        const endNodeId = newEndNodes[index].id; // Corresponding end node ID

        return [
          {
            id: `${selectedNode.id}_${branchNodeId}`,
            source: selectedNode.id,
            target: branchNodeId,
            type: EDGE_TYPES.NORMAL_EDGE,
          },
          {
            id: `${branchNodeId}_${endNodeId}`,
            source: branchNodeId,
            target: endNodeId,
            type: EDGE_TYPES.ADD_EDGE,
          },
        ];
      });

      return [...filteredEdges, ...newEdges];
    });

    // Update selectedNode to the latest version
    const updatedSelectedNode = nodes.find((n) => n.id === selectedNode.id);
    if (updatedSelectedNode) {
      setSelectedNode(updatedSelectedNode);
    }
  };

  const handleElseChange = (newElseNode: ElseNodeType, branchCount: number) => {
    if (!selectedNode) return;
    console.log("selectedNode", selectedNode);

    const baseX = selectedNode.position.x;
    const baseY = selectedNode.position.y;

    // Calculate the position of the ElseNode
    const elseNodePosition = {
      x: baseX + (branchCount - branchCount / 2) * NODE_HORIZONTAL_SPACING,
      y: baseY + NODE_VERTICAL_SPACING,
    };

    // Create the ElseNode
    const elseNode: Node = {
      id: newElseNode.id,
      type: NODE_TYPES.ELSE_NODE,
      data: { label: newElseNode.data.label || NODE_LABELS.ELSE_NODE },
      position: elseNodePosition,
    };

    // Create the EndNode for the ElseNode
    const endNode: Node = {
      id: uuidv4(),
      type: NODE_TYPES.END_NODE,
      data: { label: NODE_LABELS.END_NODE },
      position: {
        x: elseNodePosition.x,
        y: elseNodePosition.y + NODE_VERTICAL_SPACING,
      },
    };

    // Add the new nodes
    setNodes((ns) => [...ns, elseNode, endNode]);

    // Add the edges connecting the selectedNode to the ElseNode and the ElseNode to the EndNode
    setEdges((es) => [
      ...es,
      {
        id: `${selectedNode.id}_${elseNode.id}`,
        source: selectedNode.id,
        target: elseNode.id,
        type: EDGE_TYPES.NORMAL_EDGE,
      },
      {
        id: `${elseNode.id}_${endNode.id}`,
        source: elseNode.id,
        target: endNode.id,
        type: EDGE_TYPES.ADD_EDGE,
      },
    ]);
  };

  const handleDelete = () => {
    if (!selectedNode) return;

    const incomingEdge = edges.find((e) => e.target === selectedNode.id);
    const outgoingEdge = edges.find((e) => e.source === selectedNode.id);

    if (selectedNode.type === NODE_TYPES.ACTION_NODE) {
      // Remove the selected node and its edges
      const descendants = getDescendantsBFS(selectedNode.id, edges);

      setNodes((ns) =>
        ns
          .filter((n) => n.id !== selectedNode.id)
          .map((n) =>
            descendants.has(n.id)
              ? {
                  ...n,
                  position: {
                    ...n.position,
                    y: n.position.y - NODE_VERTICAL_SPACING,
                  },
                }
              : n
          )
      );

      setEdges((es) =>
        es.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );

      // Create new edge if both incoming and outgoing edges exist
      if (incomingEdge && outgoingEdge) {
        const newEdge = {
          id: `${incomingEdge.source}-${outgoingEdge.target}`,
          source: incomingEdge.source,
          target: outgoingEdge.target,
          type: EDGE_TYPES.ADD_EDGE,
        };
        setEdges((es) => [...es, newEdge]);
      }
    } else if (selectedNode.type === NODE_TYPES.IF_ELSE_NODE) {
      const branches = selectedNode.data.branches;

      if (Array.isArray(branches) && branches.length > 0) {
        const branchNodeId = nodes.find(
          (n) =>
            n.type === NODE_TYPES.BRANCH_NODE &&
            n.data.label === branches[0] &&
            edges.some((e) => e.source === selectedNode.id && e.target === n.id)
        )?.id;

        const parentId = incomingEdge?.source;

        if (!branchNodeId || !parentId) {
          console.log("Missing branch node or parent node for IF_ELSE_NODE");
          return;
        }

        // Find the continuation child of the branch node to reconnect to
        const branchChildren = edges
          .filter((e) => e.source === branchNodeId)
          .map((e) => e.target);
        const branchContinueChildId = branchChildren[0];

        if (!branchContinueChildId) {
          console.log("No continuation child for branch node");
          return;
        }

        // Connect parent to continuation node
        const newEdge = {
          id: `${parentId}-${branchContinueChildId}`,
          source: parentId,
          target: branchContinueChildId,
          type: EDGE_TYPES.ADD_EDGE,
        };

        // Get all descendants of IF_ELSE_NODE
        const allDescendants = getDescendantsBFS(selectedNode.id, edges);

        // Get protected descendants (those under branchContinueChildId)
        const protectedDescendants = getDescendantsBFS(
          branchContinueChildId,
          edges
        );

        // Actual nodes to delete = allDescendants - protectedDescendants
        const nodesToDelete = [...allDescendants].filter(
          (id) => !protectedDescendants.has(id)
        );

        // Delete nodes
        setNodes((ns) => ns.filter((n) => !nodesToDelete.includes(n.id)));

        // Delete edges
        setEdges((es) => [
          ...es.filter(
            (e) =>
              !nodesToDelete.includes(e.source) &&
              !nodesToDelete.includes(e.target) &&
              e.source !== selectedNode.id &&
              e.target !== selectedNode.id
          ),
          newEdge,
        ]);

        // Shift the x-position of the protected descendants
        const xOffset = NODE_HORIZONTAL_SPACING / 2;
        setNodes((ns) =>
          ns.map((n) => {
            if (protectedDescendants.has(n.id)) {
              return {
                ...n,
                position: {
                  ...n.position,
                  x: n.position.x + xOffset,
                },
              };
            }
            return n;
          })
        );

        // Shift the y-position of the protected descendants
        const parentNode = nodes.find((n) => n.id === parentId);
        const continuationNode = nodes.find(
          (n) => n.id === branchContinueChildId
        );

        if (parentNode && continuationNode) {
          const currentGap =
            continuationNode.position.y - parentNode.position.y;
          const yOffset = currentGap - NODE_VERTICAL_SPACING;

          if (yOffset > 0) {
            // Adjust the position of the continuationNode
            setNodes((ns) =>
              ns.map((n) =>
                protectedDescendants.has(n.id)
                  ? {
                      ...n,
                      position: {
                        ...n.position,
                        y: n.position.y - yOffset, // Shift the y position
                      },
                    }
                  : n
              )
            );
          }
        }
      }
    }

    setSelectedNode(null);
    setSheetOpen(false);
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodeOrigin={[0.5, 0.5]}
          deleteKeyCode={[]}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <EditNodeSheet
          node={selectedNode as EditableNode | null}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onLabelChange={handleLabelChange}
          onDelete={handleDelete}
          onBranchesChange={handleBranchesChange}
          onElseChange={handleElseChange}
        />
      </ReactFlowProvider>
    </div>
  );
}
