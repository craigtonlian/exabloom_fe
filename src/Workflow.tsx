import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from './components/StartNode';
import EndNode from './components/EndNode';
import ActionNode from './components/ActionNode';
import AddEdge from './components/AddEdge';

const nodeTypes = {
  'startNode': StartNode,
  'endNode': EndNode,
  'actionNode': ActionNode,
};
const edgeTypes = {
  addEdge: AddEdge,
};

const initialEdges: Edge[] = [
  {
    id: '1-2',
    source: '1',
    target: '2',
    label: '+',
    type: 'addEdge',
  },
];

const initialNodes: Node[] = [
  {
    id: '1',
    data: {},
    position: { x: 100, y: 0 },
    type: 'startNode',
  },
  // {
  //   id: '2',
  //   data: { label: 'Action' },
  //   position: { x: 100, y: 100 },
  //   type: 'actionNode',
  // },
  {
    id: '2',
    data: { label: 'End' },
    position: { x: 100, y: 200 },
    type: 'endNode',
  },
];

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = { ...connection, type: 'addEdge' };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  return (
    <div style={{ height: '100%', width: '100%', border: '1px solid black' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
