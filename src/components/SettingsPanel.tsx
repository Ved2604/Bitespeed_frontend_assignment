// src/components/SettingsPanel.tsx

import { useState, useEffect } from "react";
import "./SettingsPanel.css";

interface SettingsPanelProps {
  selectedNodeData?: {
    message: string;
    label: string;
  };
  onClose?: () => void;
  onUpdateNode?: (newData: { message: string }) => void;
}

export default function SettingsPanel({
  selectedNodeData,
  onClose,
  onUpdateNode,
}: SettingsPanelProps) {
  const [messageText, setMessageText] = useState(
    selectedNodeData?.message || "test message 2"
  );

  // Update messageText when selectedNodeData changes
  useEffect(() => {
    if (selectedNodeData?.message) {
      setMessageText(selectedNodeData.message);
    }
  }, [selectedNodeData]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessageText(newMessage);

    // Update the node in real-time
    if (onUpdateNode) {
      onUpdateNode({ message: newMessage });
    }
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <button className="back-button" onClick={onClose}>
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
