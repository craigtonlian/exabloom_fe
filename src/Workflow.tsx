import {
  EDGE_TYPES,
  EDITABLE_NODES,
  NODE_TYPES,
  NODE_VERTICAL_SPACING,
} from "@/constants";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  type Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import ActionNode from "./components/ActionNode";
import AddEdge from "./components/AddEdge";
import BranchNode from "./components/BranchNode";
import { useEditNode } from "./components/EditNodeContext";
import EditNodeSheet from "./components/EditNodeSheet";
import ElseNode from "./components/ElseNode";
import EndNode from "./components/EndNode";
import IfElseNode from "./components/IfElseNode";
import NormalEdge from "./components/NormalEdge";
import StartNode from "./components/StartNode";
import { CustomNode } from "./types/nodes";

const initialEdges: Edge[] = [
  {
    id: uuidv4(),
    source: "1",
    target: "2",
    type: "addEdge",
  },
];

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Start Node" },
    position: { x: 300, y: 300 },
    type: "startNode",
  },
  {
    id: "2",
    data: { label: "End Node" },
    position: { x: 300, y: 450 },
    type: "endNode",
  },
];

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  // const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const { selectedNode, setSelectedNode, sheetOpen, setSheetOpen } =
    useEditNode();

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

  const handleBranchesChange = (newBranches: string[]) => {
    setNodes((ns) =>
      ns.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, branches: newBranches } }
          : n
      )
    );
  };

  const handleElseChange = (newElse: string) => {
    setNodes((ns) =>
      ns.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, else: newElse } }
          : n
      )
    );
  };

  const handleDelete = () => {
    if (!selectedNode) return;

    // Find edges connected to the selected node
    const incomingEdge = edges.find((e) => e.target === selectedNode.id);
    const outgoingEdge = edges.find((e) => e.source === selectedNode.id);

    // Remove the selected node and its edges
    setNodes((ns) =>
      ns
        .filter((n) => n.id !== selectedNode.id)
        .map((n) =>
          n.position.y > selectedNode.position.y &&
          n.position.x === selectedNode.position.x
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
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={[0.5, 0.5]}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <EditNodeSheet
        node={selectedNode as CustomNode | null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onLabelChange={handleLabelChange}
        onDelete={handleDelete}
        onBranchesChange={handleBranchesChange}
        onElseChange={handleElseChange}
      />
    </div>
  );
}
