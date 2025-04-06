import { NODE_TYPES } from "@/constants";
import { Node } from "@xyflow/react";

export type ActionNode = Node & {
  type?: NODE_TYPES.ACTION_NODE;
  data?: ActionNodeData;
};

export type ActionNodeData = {
  label?: string;
};

export type BranchNode = Node & {
  type?: NODE_TYPES.BRANCH_NODE;
  data?: BranchNodeData;
};

export type BranchNodeData = {
  label?: string;
};

export type IfElseNode = Node & {
  type?: NODE_TYPES.IF_ELSE_NODE;
  data?: IfElseNodeData;
};

export type IfElseNodeData = {
  label?: string;
  branches?: string[];
  else?: string;
};

export type ElseNode = Node & {
  type?: NODE_TYPES.ELSE_NODE;
  data?: ElseNodeData;
};

export type ElseNodeData = {
  label?: string;
};

export type EndNode = Node & {
  type?: NODE_TYPES.END_NODE;
  data?: EndNodeData;
};

export type EndNodeData = {
  label?: string;
};

export type StartNode = Node & {
  type?: NODE_TYPES.START_NODE;
  data?: StartNodeData;
};

export type StartNodeData = {
  label?: string;
};

export type AllNode =
  | ActionNode
  | IfElseNode
  | BranchNode
  | ElseNode
  | EndNode
  | StartNode
  | Node;

export type EditableNode = ActionNode | IfElseNode;
