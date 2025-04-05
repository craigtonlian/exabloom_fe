export enum NODE_TYPES {
  START_NODE = "startNode",
  END_NODE = "endNode",
  ACTION_NODE = "actionNode",
  IF_ELSE_NODE = "ifElseNode",
  BRANCH_NODE = "branchNode",
  ELSE_NODE = "elseNode",
}
export enum EDGE_TYPES {
  NORMAL_EDGE = "normalEdge",
  ADD_EDGE = "addEdge",
}
export enum NODE_LABELS {
  START_NODE = "Start Node",
  END_NODE = "END",
  ACTION_NODE = "Action Node",
  IF_ELSE_NODE = "If-Else Node",
  BRANCH_NODE = "Branch",
  ELSE_NODE = "Else",
}

export const NODE_VERTICAL_SPACING: number = 150;
export const NODE_HORIZONTAL_SPACING: number = 400;
export const EDITABLE_NODES: string[] = [
  NODE_TYPES.ACTION_NODE,
  NODE_TYPES.IF_ELSE_NODE,
];
