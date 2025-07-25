import { useCallback, useRef } from "react";
import ReactFlow, { Background, Controls, ReactFlowInstance } from "reactflow";

import "reactflow/dist/style.css";
import MessageNode from "./MessageNode";
//import CallNode from "./CallNode";
//import ApiNode from "./ApiNode";
import Sidebar from "./Sidebar";
import { useFlowStore } from "../store/flowStore";

// Register all node types with React Flow
const nodeTypes = {
  messageNode: MessageNode,
  //callNode: CallNode,
  //apiNode: ApiNode,
};

export default function FlowBuilder() {
  // Replace React Flow hooks with Zustand store
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);
  const addNode = useFlowStore((state) => state.addNode);
  const selectNode = useFlowStore((state) => state.selectNode);
  const clearSelection = useFlowStore((state) => state.clearSelection);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType || !reactFlowInstance.current) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: event.clientX - (bounds?.left ?? 0),
        y: event.clientY - (bounds?.top ?? 0),
      });

      // Use Zustand store's addNode method (which has all your logic)
      addNode(nodeType, position);
    },
    [addNode]
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
      <Sidebar />
    </div>
  );
}
