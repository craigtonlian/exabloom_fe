// import { AllNode } from "@/types/nodes";
// import { createContext, useContext, useState } from "react";

// type EditNodeContextType = {
//   selectedNode: AllNode | null;
//   setSelectedNode: (node: AllNode | null) => void;
//   sheetOpen: boolean;
//   setSheetOpen: (open: boolean) => void;
// };

// const EditNodeContext = createContext<EditNodeContextType | undefined>(
//   undefined
// );

// export function EditNodeProvider({ children }: { children: React.ReactNode }) {
//   const [selectedNode, setSelectedNode] = useState<AllNode | null>(null);
//   const [sheetOpen, setSheetOpen] = useState(false);

//   return (
//     <EditNodeContext.Provider
//       value={{ selectedNode, setSelectedNode, sheetOpen, setSheetOpen }}
//     >
//       {children}
//     </EditNodeContext.Provider>
//   );
// }

// export function useEditNode() {
//   const context = useContext(EditNodeContext);
//   if (!context) {
//     throw new Error("useEditNode must be used within an EditNodeProvider");
//   }
//   return context;
// }
