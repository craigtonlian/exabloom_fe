import { NODE_TYPES } from "@/constants";
import { Node } from "@xyflow/react";

export type ActionNode = Node & {
  type: NODE_TYPES.ACTION_NODE;
  data: ActionNodeData;
};

export type ActionNodeData = {
  label?: string;
};

export type IfElseNode = Node & {
  type: NODE_TYPES.IF_ELSE_NODE;
  data: IfElseNodeData;
};

export type IfElseNodeData = {
  label?: string;
  branches?: string[];
  else?: string;
};

export type CustomNode = ActionNode | IfElseNode;
