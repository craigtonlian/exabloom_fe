import type { Node } from "@xyflow/react";
import { createContext, useContext, useState } from "react";

type EditNodeContextType = {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
};

const EditNodeContext = createContext<EditNodeContextType | undefined>(
  undefined
);

export function EditNodeProvider({ children }: { children: React.ReactNode }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <EditNodeContext.Provider
      value={{ selectedNode, setSelectedNode, sheetOpen, setSheetOpen }}
    >
      {children}
    </EditNodeContext.Provider>
  );
}

export function useEditNode() {
  const context = useContext(EditNodeContext);
  if (!context) {
    throw new Error("useEditNode must be used within an EditNodeProvider");
  }
  return context;
}
