import { Handle, Position, NodeProps } from "reactflow";
import { Phone } from "lucide-react";
import { CallNodeData } from "../types/nodeRegistry";

export default function CallNode({ data, selected }: NodeProps<CallNodeData>) {
  return (
    <div className={`message-node ${selected ? "selected" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="handle target-handle"
      />

      <div
        className="message-node-header"
        style={{ backgroundColor: "#d1fae5" }}
      >
        <div className="header-left">
          <Phone
            className="message-icon"
            size={16}
            style={{ color: "#10b981" }}
          />
          <span className="message-label">Make Call</span>
        </div>
        <div className="header-right">
          <Phone size={16} style={{ color: "#10b981" }} />
        </div>
      </div>

      <div className="message-content">
        {data.phoneNumber || "Enter phone number"}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="handle source-handle"
      />
    </div>
  );
}
