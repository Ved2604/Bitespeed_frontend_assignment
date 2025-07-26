// src/components/SettingsPanel.tsx

import { useState, useEffect } from "react";
import "./SettingsPanel.css";
import { useFlowStore } from "../store/flowStore";

// Remove all props - get everything from Zustand
export default function SettingsPanel() {
  // Get data and actions from Zustand store
  const selectedNodeId = useFlowStore((state) => state.selectedNodeId);
  const nodes = useFlowStore((state) => state.nodes);
  const updateNode = useFlowStore((state) => state.updateNode);
  const clearSelection = useFlowStore((state) => state.clearSelection);

  // Find the selected node
  const selectedNode = selectedNodeId
    ? nodes.find((node) => node.id === selectedNodeId)
    : null;

  const [messageText, setMessageText] = useState(
    selectedNode?.data?.message || "test message 2"
  );

  // Update messageText when selected node changes
  useEffect(() => {
    if (selectedNode?.data?.message) {
      setMessageText(selectedNode.data.message);
    }
  }, [selectedNode]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessageText(newMessage);

    // Update the node in real-time using Zustand
    if (selectedNodeId) {
      updateNode(selectedNodeId, { message: newMessage });
    }
  };

  const handleClose = () => {
    clearSelection();
  };

  if (!selectedNode) {
    return null; // Safety check
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <button className="back-button" onClick={handleClose}>
          ←
        </button>
        <h3 className="settings-title">Message</h3>
      </div>

      <div className="settings-content">
        <div className="text-field">
          <label className="text-label">Text</label>
          <textarea
            className="text-textarea"
            value={messageText}
            onChange={handleMessageChange}
            placeholder="Enter message text..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
