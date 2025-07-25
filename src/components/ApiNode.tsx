import { Handle, Position, NodeProps } from "reactflow";
import { Zap } from "lucide-react";
import { ApiNodeData } from "../types/nodeRegistry";

export default function ApiNode({ data, selected }: NodeProps<ApiNodeData>) {
  return (
    <div className={`message-node ${selected ? "selected" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="handle target-handle"
      />

      <div
        className="message-node-header"
        style={{ backgroundColor: "#fef3c7" }}
      >
        <div className="header-left">
          <Zap
            className="message-icon"
            size={16}
            style={{ color: "#f59e0b" }}
          />
          <span className="message-label">API Call</span>
        </div>
        <div className="header-right">
          <div
            style={{
              backgroundColor: "#f59e0b",
              color: "white",
              fontSize: "10px",
              padding: "2px 6px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            {data.method || "GET"}
          </div>
        </div>
      </div>

      <div className="message-content">{data.endpoint || "/api/endpoint"}</div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="handle source-handle"
      />
    </div>
  );
}
