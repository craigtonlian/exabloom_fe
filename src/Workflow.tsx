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
    position: { x: 100, y: 200 },
    type: "endNode",
  },
  {
    id: "3",
    data: { actionName: "Action 1" },
    position: { x: 100, y: 400 },
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

  const handleLabelChange = (newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, label: newLabel } }
          : n
      )
    );
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
    setSheetOpen(false);
  };

  return (
    <div style={{ height: "100%", width: "100%", border: "1px solid black" }}>
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
      </ReactFlow>

      <ActionNodeSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        node={selectedNode}
        onLabelChange={handleLabelChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
