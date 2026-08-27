import axios from 'axios';

export interface CircuitSettings {
  gridSize: number;
  snapToGrid: boolean;
}

export interface CircuitNode {
  id: string;
  type: string;
  x: number;
  y: number;
  state?: Record<string, unknown>;
}

export interface CircuitEdge {
  id: string;
  sourceNodeId: string;
  sourceHandle?: string;
  targetNodeId: string;
  targetHandle?: string;
}

export interface CreateCircuitRequest {
  name: string;
  createdBy: string;
  settings?: CircuitSettings | null;
}

export interface CircuitSummary {
  id: string;
  name: string;
  createdBy: string;
  activeUsersCount: number;
  nodesCount: number;
}

export const circuitApi = {
  async getCircuits(): Promise<CircuitSummary[]> {
    const response = await axios.get<CircuitSummary[]>('/api/circuits');
    return response.data;
  },

  async createCircuit(request: CreateCircuitRequest): Promise<{ id: string; name: string }> {
    const response = await axios.post('/api/circuits', request);
    return response.data;
  },

  async getCircuit(circuitId: string): Promise<unknown> {
    const response = await axios.get(`/api/circuits/${circuitId}`);
    return response.data;
  },
};