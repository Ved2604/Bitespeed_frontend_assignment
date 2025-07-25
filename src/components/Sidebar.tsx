// src/components/Sidebar.tsx
import "./Sidebar.css";
import NodesPanel from "./NodesPanel";
import SettingsPanel from "./SettingsPanel";
import { useFlowStore } from "../store/flowStore";

// Remove all the props - we'll get everything from Zustand
export default function Sidebar() {
  // Get state directly from Zustand store
  const showSettingsPanel = useFlowStore((state) => state.showSettingsPanel);

  return (
    <aside className="sidebar">
      {showSettingsPanel ? <SettingsPanel /> : <NodesPanel />}
    </aside>
  );
}
