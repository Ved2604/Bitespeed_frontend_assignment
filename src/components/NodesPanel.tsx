// src/components/NodesPanel.tsx
import { DragEvent } from "react";
import { NODE_TYPE_REGISTRY } from "../types/nodeRegistry";
import "./NodesPanel.css";

export default function NodesPanel() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="nodes-panel">
      <h3 className="panel-title">Nodes</h3>

      <div className="node-types-grid">
        {Object.values(NODE_TYPE_REGISTRY).map((nodeConfig) => {
          const IconComponent = nodeConfig.icon;

          return (
            <div
              key={nodeConfig.key}
              className="node-icon-container"
              onDragStart={(event) => onDragStart(event, nodeConfig.key)}
              draggable
              style={{ borderColor: nodeConfig.color }}
            >
              <IconComponent
                className="node-icon"
                size={32}
                style={{ color: nodeConfig.color }}
              />
              <span className="node-label">{nodeConfig.displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
