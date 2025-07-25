import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";

import "reactflow/dist/style.css";
import MessageNode from "./MessageNode";
//import CallNode from "./CallNode";
//import ApiNode from "./ApiNode";
import Sidebar from "./Sidebar";
import { NODE_TYPE_REGISTRY } from "../types/nodeRegistry";

// Register all node types with React Flow
const nodeTypes = {
  messageNode: MessageNode,
  //callNode: CallNode,
  //apiNode: ApiNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "messageNode",
    position: { x: 250, y: 50 },
    data: {
      type: "message",
      label: "Send Message",
      message: "text message 1",
    },
  },
];

const initialEdges: Edge[] = [];

let id = 2;
const getId = () => `${id++}`;

interface FlowBuilderProps {
  onFlowChange?: (nodes: Node[], edges: Edge[]) => void;
}

export default function FlowBuilder({ onFlowChange }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Call onFlowChange whenever nodes or edges change
  useEffect(() => {
    if (onFlowChange) {
      onFlowChange(nodes, edges);
    }
  }, [nodes, edges, onFlowChange]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (newData: any) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        })
      );

      // Update the selectedNode state as well
      setSelectedNode((prev) =>
        prev ? { ...prev, data: { ...prev.data, ...newData } } : null
      );
    },
    [selectedNode, setNodes]
  );

  const onClearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  let messageCodeCount = 1;
  let callCodeCount = 0;
  let apiCodeCount = 0;

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType || !reactFlowInstance.current) return;

      // Get the node configuration from registry
      const nodeConfig = NODE_TYPE_REGISTRY[nodeType];
      if (!nodeConfig) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: event.clientX - (bounds?.left ?? 0),
        y: event.clientY - (bounds?.top ?? 0),
      });

      const nodeId = getId();

      if (nodeConfig.defaultData.type === "message") {
        messageCodeCount++;
      } else if (nodeConfig.defaultData.type === "call") {
        callCodeCount++;
      } else if (nodeConfig.defaultData.type === "api") {
        apiCodeCount++;
      }
      const newNode: Node = {
        id: nodeId.toString(),
        type: nodeType,
        position,
        data: {
          ...nodeConfig.defaultData,
          // Add unique identifier to the message/content
          ...(nodeConfig.defaultData.type === "message" && {
            message: `${nodeConfig.defaultData.message} ${messageCodeCount}`,
          }),
          ...(nodeConfig.defaultData.type === "call" && {
            phoneNumber: `+123456789${callCodeCount}`,
          }),
          ...(nodeConfig.defaultData.type === "api" && {
            endpoint: `${nodeConfig.defaultData.endpoint}/${apiCodeCount}`,
          }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
        style={{ flexGrow: 1 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          onInit={(rfi) => (reactFlowInstance.current = rfi)}
          defaultViewport={{ x: 400, y: 300, zoom: 1 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar
        selectedNode={selectedNode}
        onUpdateNode={updateNodeData}
        onClearSelection={onClearSelection}
      />
    </div>
  );
}
