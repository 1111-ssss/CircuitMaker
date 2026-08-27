import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';

export interface ConnectionSlice {
  circuitId: string | null;
  userName: string;
  setUserName: (name: string) => void;
  initConnection: (circuitId: string, userName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
}

export interface CircuitFlowSlice {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  toggleInputNode: (nodeId: string, currentValue: boolean) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export interface PresenceSlice {
  cursors: Record<string, { x: number; y: number, userName: string }>;
  sendCursor: (x: number, y: number) => void;
  updateCursor: (connectionId: string, x: number, y: number, userName: string) => void;
  removeCursor: (connectionId: string) => void;
  clearCursors: () => void;
}

export type CircuitState = ConnectionSlice & CircuitFlowSlice & PresenceSlice;