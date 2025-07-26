# Chatbot Flow Builder

A modern, extensible chatbot flow builder built with **React**, **TypeScript**, **React Flow**, and **Zustand**. Create complex chatbot workflows with an intuitive drag-and-drop interface.

![Flow Builder Demo](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Chatbot+Flow+Builder)

## Features

- **Drag & Drop Interface** - Intuitive node creation and connection
- **Real-time Editing** - Live text editing with instant preview
- **Smart Validation** - Comprehensive flow validation before saving
- **Extensible Architecture** - Easy to add new node types
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **State Management** - Robust Zustand store with no prop drilling
- **Connection Rules** - Enforces chatbot flow constraints

## Architecture Overview

### Core Technologies

- **React 18** + **TypeScript** - Type-safe component development
- **React Flow** - Professional flow/diagram library
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast development and build tool

### Project Structure

```
src/
├── components/
│   ├── FlowBuilder/           # Main flow canvas
│   │   ├── FlowBuilder.tsx    # React Flow integration
│   │   ├── NodesPanel.tsx     # Extensible node palette
│   │   ├── SettingsPanel.tsx  # Node editing interface
│   │   └── Sidebar.tsx        # Panel orchestration
│   ├── Nodes/                 # Node components
│   │   ├── MessageNode.tsx    # Text message node
│   │   ├── CallNode.tsx       # Phone call node (ready)
│   │   └── ApiNode.tsx        # API webhook node (ready)
│   └── Navbar.tsx             # Save functionality & validation
├── store/
│   └── flowStore.ts           # Zustand state management
└── types/
    └── nodeRegistry.ts        # Extensible node system
```

## Key Features Implemented

### Assignment Requirements Met

1. **Text Node** - Editable message nodes with WhatsApp-style UI
2. **Nodes Panel** - Extensible drag-and-drop node palette
3. **Edge System** - Smart connection handling with constraints
4. **Settings Panel** - Real-time node editing interface
5. **Save Validation** - Prevents invalid flow configurations
6. **Source Handle Limits** - One outgoing connection per node
7. **Extensible Design** - Ready for future node types

### Advanced Features

- **Real-time Updates** - Changes reflect immediately across components
- **Connection Validation** - Prevents duplicate outgoing connections
- **Visual Feedback** - Clear success/error messages for save operations
- **Responsive Design** - Works on desktop and tablet devices
- **Type Safety** - Full TypeScript coverage for robust development

## Extensibility: Adding New Node Types

### The Registry Pattern

Our architecture uses a centralized registry system that makes adding new node types incredibly simple:

```typescript
// src/types/nodeRegistry.ts
export const NODE_TYPE_REGISTRY: Record<string, NodeTypeConfig> = {
  messageNode: {
    key: "messageNode",
    displayName: "Message",
    icon: MessageCircleMore,
    defaultData: {
      type: "message",
      message: "text message",
      label: "Send Message",
    },
    color: "#3b82f6",
  },

  // Ready to activate - just uncomment!
  callNode: {
    key: "callNode",
    displayName: "Call",
    icon: Phone,
    defaultData: {
      type: "call",
      phoneNumber: "+1234567890",
      label: "Make Call",
    },
    color: "#10b981",
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
    },
    color: "#f59e0b",
  },
};
```

### How to Add a New Node Type (5 Simple Steps)

#### 1. Define Data Interface

```typescript
// Add to nodeRegistry.ts
export interface WebhookNodeData {
  type: "webhook";
  url: string;
  headers: Record<string, string>;
  label: string;
}
```

#### 2. Add to Registry

```typescript
webhookNode: {
  key: "webhookNode",
  displayName: "Webhook",
  icon: Globe,
  defaultData: {
    type: "webhook",
    url: "https://api.example.com/webhook",
    headers: {},
    label: "Send Webhook",
  } as WebhookNodeData,
  color: "#8b5cf6"
}
```

#### 3. Create Node Component

```typescript
// components/Nodes/WebhookNode.tsx
export default function WebhookNode({
  data,
  selected,
}: NodeProps<WebhookNodeData>) {
  return (
    <div className={`message-node ${selected ? "selected" : ""}`}>
      {/* Your custom UI */}
    </div>
  );
}
```

#### 4. Register with React Flow

```typescript
// components/FlowBuilder/FlowBuilder.tsx
const nodeTypes = {
  messageNode: MessageNode,
  callNode: CallNode,
  apiNode: ApiNode,
  webhookNode: WebhookNode, // Add here
};
```

#### 5. That's It!

The new node type will automatically:

- Appear in the NodesPanel
- Support drag & drop creation
- Integrate with Zustand store
- Work with selection/editing
- Follow validation rules
- Get proper ID management

### Why This Architecture Scales

**Single Source of Truth**

- All node types defined in one place
- Consistent interface across components
- Easy to modify existing types

**Automatic Integration**

- NodesPanel automatically renders all registry entries
- Zustand store handles any node type generically
- No component modifications needed

**Consistent Styling**

- Registry includes color schemes
- Standardized icons from Lucide React
- Uniform visual hierarchy

**Type Safety**

- Full TypeScript support
- Compile-time error catching
- IntelliSense autocompletion

## State Management with Zustand

### Why Zustand Over Redux/Context?

Our Zustand store provides:

- **Performance** - No unnecessary re-renders
- **Simplicity** - No boilerplate or providers needed
- **Direct Access** - Components get exactly what they need
- **Type Safety** - Full TypeScript integration

### Store Architecture

```typescript
interface FlowStore {
  // Core React Flow state
  nodes: Node[];
  edges: Edge[];

  // UI state
  selectedNodeId: string | null;
  showSettingsPanel: boolean;

  // Node management
  addNode: (nodeType: string, position: Position) => void;
  updateNode: (id: string, data: any) => void;
  selectNode: (id: string | null) => void;

  // Validation & persistence
  validateFlow: () => ValidationResult;

  // React Flow integration
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}
```

### Benefits of Our Store Design

**Selective Subscriptions**

```typescript
// Components only re-render when their data changes
const nodes = useFlowStore((state) => state.nodes);
const selectedId = useFlowStore((state) => state.selectedNodeId);
```

**Automatic Sync**

- React Flow hooks integrated with store
- Real-time updates across all components
- Consistent state everywhere

## Validation & Flow Rules

### Connection Validation

Our system enforces chatbot flow rules:

```typescript
onConnect: (connection) => {
  // Source Handle Limit: Only one outgoing connection
  const existingEdge = edges.find(
    (edge) =>
      edge.source === connection.source &&
      edge.sourceHandle === connection.sourceHandle
  );

  if (existingEdge) {
    alert("Source handle can only have one outgoing edge");
    return; // Block connection
  }

  // Allow valid connections
  addEdge(connection);
};
```

### Save Validation

```typescript
validateFlow: () => {
  const nodesWithoutTarget = nodes.filter(
    (node) => !edges.some((edge) => edge.target === node.id)
  );

  // Multiple unconnected nodes = invalid flow
  if (nodesWithoutTarget.length > 1) {
    return {
      isValid: false,
      error: "Multiple nodes with empty target handles",
    };
  }

  return { isValid: true };
};
```

### Component Hierarchy

```
App
├── Navbar (Save functionality)
├── FlowBuilder (Main canvas)
    ├── ReactFlow (Flow diagram)
    └── Sidebar
        ├── NodesPanel (When nothing selected)
        └── SettingsPanel (When node selected)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>


# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

### Basic Flow Creation

1. Drag a Message node from the panel
2. Click the node to edit its text
3. Create another node
4. Connect them by dragging from source to target handle
5. Click "Save Changes" to validate

### Validation Testing

1. Create multiple unconnected nodes → Save should show error
2. Try connecting same source to multiple targets → Should be blocked
3. Create a proper linear flow → Save should succeed
