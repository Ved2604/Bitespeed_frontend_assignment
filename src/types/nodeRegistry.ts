// src/types/nodeRegistry.ts
import { MessageCircleMore } from "lucide-react";
//import { Phone, Zap } from "lucide-react";

// Node data interfaces
export interface MessageNodeData {
  type: "message";
  message: string;
  label: string;
}

export interface CallNodeData {
  type: "call";
  phoneNumber: string;
  label: string;
}

export interface ApiNodeData {
  type: "api";
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  label: string;
}

// Registry configuration
export interface NodeTypeConfig {
  key: string;
  displayName: string;
  icon: any; // Lucide icon component
  defaultData: any;
  color: string; // For styling
}

// Central registry of all node types
export const NODE_TYPE_REGISTRY: Record<string, NodeTypeConfig> = {
  messageNode: {
    key: "messageNode",
    displayName: "Message",
    icon: MessageCircleMore,
    defaultData: {
      type: "message",
      message: "text message",
      label: "Send Message",
    } as MessageNodeData,
    color: "#3b82f6", // Blue
  },
  /*
  callNode: {
    key: "callNode",
    displayName: "Call",
    icon: Phone,
    defaultData: {
      type: "call",
      phoneNumber: "+1234567890",
      label: "Make Call",
    } as CallNodeData,
    color: "#10b981", // Green
  },

  apiNode: {
    key: "apiNode",
    displayName: "API",
    icon: Zap,
    defaultData: {
      type: "api",
      endpoint: "/api/endpoint",
      method: "GET",
      label: "API Call",
    } as ApiNodeData,
    color: "#f59e0b", // Amber
  },*/
} as const;

// Type utilities
export type ValidNodeTypes = keyof typeof NODE_TYPE_REGISTRY;
export type ValidNodeData = MessageNodeData | CallNodeData | ApiNodeData;
