import { Node } from "@xyflow/react";

export type ActionNode = Node & {
  type: "actionNode";
  data: ActionNodeData;
};

export type ActionNodeData = {
  label?: string;
};

export type IfElseNode = Node & {
  type: "ifElseNode";
  data: IfElseNodeData;
};

export type IfElseNodeData = {
  label?: string;
  branches?: string[];
  else?: string;
};

export type CustomNode = ActionNode | IfElseNode;
