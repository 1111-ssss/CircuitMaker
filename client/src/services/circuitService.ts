import { circuitApi, type CircuitNode, type CircuitEdge, type CircuitSummary } from '../api/circuitApi';
import { circuitSignalRService } from './circuitSignalRService';

export type { CircuitSummary };

class CircuitService {
  async getCircuits(): Promise<CircuitSummary[]> {
    return circuitApi.getCircuits();
  }

  async createCircuit(name: string, createdBy: string) {
    return circuitApi.createCircuit({ name, createdBy });
  }

  async getCircuit(circuitId: string) {
    return circuitApi.getCircuit(circuitId);
  }

  async connectHub() {
    return circuitSignalRService.connectHub();
  }

  async disconnectHub() {
    return circuitSignalRService.disconnectHub();
  }

  async joinCircuit(circuitId: string, rawName: string) {
    return circuitSignalRService.joinCircuit(circuitId, rawName);
  }

  async updateNodes(circuitId: string, nodes: CircuitNode[]) {
    return circuitSignalRService.updateNodes(circuitId, nodes);
  }

  async updateEdges(circuitId: string, edges: CircuitEdge[]) {
    return circuitSignalRService.updateEdges(circuitId, edges);
  }

  async toggleInput(circuitId: string, nodeId: string, value: boolean) {
    return circuitSignalRService.toggleInput(circuitId, nodeId, value);
  }

  async sendCursorPosition(circuitId: string, x: number, y: number, userName: string) {
    return circuitSignalRService.sendCursorPosition(circuitId, x, y, userName);
  }

  onJoinedCircuit(callback: (data: { assignedName: string; circuit: any }) => void) {
    circuitSignalRService.onJoinedCircuit(callback);
  }

  onUserJoined(callback: (user: any) => void) {
    circuitSignalRService.onUserJoined(callback);
  }

  onUserLeft(callback: (connectionId: string) => void) {
    circuitSignalRService.onUserLeft(callback);
  }

  onNodesUpdated(callback: (nodes: CircuitNode[]) => void) {
    circuitSignalRService.onNodesUpdated(callback);
  }

  onEdgesUpdated(callback: (edges: CircuitEdge[]) => void) {
    circuitSignalRService.onEdgesUpdated(callback);
  }

  onSignalStateUpdated(callback: (states: Record<string, boolean>) => void) {
    circuitSignalRService.onSignalStateUpdated(callback);
  }

  onCursorMoved(callback: (data: { connectionId: string; x: number; y: number; userName: string }) => void) {
    circuitSignalRService.onCursorMoved(callback);
  }

  unsubscribeAll() {
    circuitSignalRService.unsubscribeAll();
  }
}

export const circuitService = new CircuitService();