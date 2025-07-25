// src/components/Sidebar.tsx
import "./Sidebar.css";
import NodesPanel from "./NodesPanel";
import SettingsPanel from "./SettingsPanel";

interface SidebarProps {
  selectedNode?: {
    id: string;
    data: {
      message: string;
      label: string;
    };
  } | null;
  onUpdateNode?: (newData: { message: string }) => void;
  onClearSelection?: () => void;
}

export default function Sidebar({
  selectedNode,
  onUpdateNode,
  onClearSelection,
}: SidebarProps) {
  // Show settings panel when a node is selected
  const showSettings = !!selectedNode;

  return (
    <aside className="sidebar">
      {showSettings ? (
        <SettingsPanel
          selectedNodeData={selectedNode?.data}
          onClose={onClearSelection}
          onUpdateNode={onUpdateNode}
        />
      ) : (
        <NodesPanel />
      )}
    </aside>
  );
}
