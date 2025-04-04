import { useState, useCallback } from "react";
import {
  type Node,
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NODE_VERTICAL_SPACING } from "@/constants";
import StartNode from "./components/StartNode";
import EndNode from "./components/EndNode";
import ActionNode from "./components/ActionNode";
import AddEdge from "./components/AddEdge";
import ActionNodeSheet from "./components/ActionNodeSheet";

const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  actionNode: ActionNode,
};

const edgeTypes = {
  addEdge: AddEdge,
};

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    type: "addEdge",
  },
];

const initialNodes: Node[] = [
  {
    id: "1",
    data: {},
    position: { x: 100, y: 0 },
    type: "startNode",
  },
  {
    id: "2",
    data: {},
    position: { x: 100, y: 150 },
    type: "endNode",
  },
  {
    id: "3",
    data: { actionName: "Action 1" },
    position: { x: -200, y: 150 },
    type: "actionNode",
  },
];

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = { ...connection, type: "addEdge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((id: any, node: Node) => {
    if (node.type === "actionNode") {
      setSelectedNode(node);
      setSheetOpen(true);
    }
  }, []);

  const handleActionNameChange = (newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, label: newLabel } }
          : n
      )
    );
  };
  const handleDeleteActionNode = () => {
    if (!selectedNode) return;

    // Find edges connected to the selected node
    const incomingEdge = edges.find((e) => e.target === selectedNode.id);
    const outgoingEdge = edges.find((e) => e.source === selectedNode.id);

    // Remove the selected node and its edges
    setNodes((ns) =>
      ns
        .filter((n) => n.id !== selectedNode.id)
        .map((n) =>
          n.position.y > selectedNode.position.y
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
        type: "addEdge",
      };
      setEdges((es) => [...es, newEdge]);
    }

    setSelectedNode(null);
    setSheetOpen(false);
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      <ActionNodeSheet
        node={selectedNode}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onActionNameChange={handleActionNameChange}
        onDeleteActionNode={handleDeleteActionNode}
      />
    </div>
  );
}
