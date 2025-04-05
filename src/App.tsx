import { EditNodeProvider } from "./components/EditNodeContext";
import Workflow from "./Workflow";

export default function App() {
  return (
    <EditNodeProvider>
      <div className="w-[100vw] h-[100vh]">
        <Workflow />
      </div>
    </EditNodeProvider>
  );
}
