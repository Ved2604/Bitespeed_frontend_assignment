import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";
import type { Node, Edge, NodeChange, EdgeChange, Connection } from "reactflow";
import { NODE_TYPE_REGISTRY } from "../types/nodeRegistry";

interface FlowStore {
  // Core React Flow state
  nodes: Node[];
  edges: Edge[];

  // Selection state
  selectedNodeId: string | null;
  showSettingsPanel: boolean;

  // Node counters (preserving your current logic)
  messageCodeCount: number;
  callCodeCount: number;
  apiCodeCount: number;

  // Node ID management (inspired by the professional example)
  nodeIDs: Record<string, number>;

  // React Flow integration actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node management actions
  addNode: (nodeType: string, position: { x: number; y: number }) => void;
  updateNode: (id: string, data: any) => void;

  // Selection actions
  selectNode: (id: string | null) => void;
  clearSelection: () => void;

  // Helper functions
  getNodeID: (type: string) => string;
  validateFlow: () => { isValid: boolean; error?: string };
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  // Initial state
  nodes: [
    // Preserve your initial node
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
  ],
  edges: [],
  selectedNodeId: null,
  showSettingsPanel: false,

  // Preserve your counter logic
  messageCodeCount: 1, // Start at 1 since we have initial node
  callCodeCount: 0,
  apiCodeCount: 0,

  // Node ID tracking (from professional example)
  nodeIDs: {
    messageNode: 1, // Since we have initial node
    callNode: 0,
    apiNode: 0,
  },

  // React Flow integration (exactly like the professional example)
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  // Node ID generation (inspired by professional example)
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${newIDs[type]}`;
  },

  // Add node action (preserving your current logic)
  addNode: (nodeType, position) => {
    const nodeConfig = NODE_TYPE_REGISTRY[nodeType];
    if (!nodeConfig) return;

    const nodeId = get().getNodeID(nodeType);
    const state = get();

    // Update counters (preserving your logic)
    let newMessageCount = state.messageCodeCount;
    let newCallCount = state.callCodeCount;
    let newApiCount = state.apiCodeCount;

    if (nodeConfig.defaultData.type === "message") {
      newMessageCount++;
    } else if (nodeConfig.defaultData.type === "call") {
      newCallCount++;
    } else if (nodeConfig.defaultData.type === "api") {
      newApiCount++;
    }

    // Create new node (preserving your logic)
    const newNode: Node = {
      id: nodeId,
      type: nodeType,
      position,
      data: {
        ...nodeConfig.defaultData,
        // Your current unique identifier logic
        ...(nodeConfig.defaultData.type === "message" && {
          message: `${nodeConfig.defaultData.message} ${newMessageCount}`,
        }),
        ...(nodeConfig.defaultData.type === "call" && {
          phoneNumber: `+123456789/${newCallCount}`,
        }),
        ...(nodeConfig.defaultData.type === "api" && {
          endpoint: `${nodeConfig.defaultData.endpoint}/${newApiCount}`,
        }),
      },
    };

    // Update state
    set({
      nodes: [...state.nodes, newNode],
      messageCodeCount: newMessageCount,
      callCodeCount: newCallCount,
      apiCodeCount: newApiCount,
    });
  },

  // Update node action (preserving your current logic)
  updateNode: (id, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      ),
    });
  },

  // Selection actions (preserving your current logic)
  selectNode: (id) => {
    set({
      selectedNodeId: id,
      showSettingsPanel: !!id,
    });
  },

  clearSelection: () => {
    set({
      selectedNodeId: null,
      showSettingsPanel: false,
    });
  },

  // Validation (preserving your current logic)
  validateFlow: () => {
    const { nodes, edges } = get();

    const nodesWithoutTarget = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );

    if (nodesWithoutTarget.length > 1) {
      return {
        isValid: false,
        error: "Cannot save Flow - More than one node has empty target handles",
      };
    }

    return { isValid: true };
  },
}));
