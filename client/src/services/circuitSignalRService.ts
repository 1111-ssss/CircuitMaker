import * as signalR from '@microsoft/signalr';
import { type CircuitNode, type CircuitEdge } from '../api/circuitApi';

export interface UserJoinedData {
  displayName: string;
  circuit: any;
}

export class CircuitSignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  async connectHub(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/api/circuitHub')
      .withAutomaticReconnect()
      .build();

    await this.hubConnection.start();
  }

  async disconnectHub(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  private isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }

  async joinCircuit(circuitId: string, rawName: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.hubConnection?.invoke('JoinCircuit', circuitId, rawName);
  }

  async updateNodes(circuitId: string, nodes: CircuitNode[]): Promise<void> {
    if (!this.isConnected()) return;
    await this.hubConnection?.invoke('UpdateNodes', circuitId, nodes);
  }

  async updateEdges(circuitId: string, edges: CircuitEdge[]): Promise<void> {
    if (!this.isConnected()) return;
    await this.hubConnection?.invoke('UpdateEdges', circuitId, edges);
  }

  async toggleInput(circuitId: string, nodeId: string, value: boolean): Promise<void> {
    if (!this.isConnected()) return;
    await this.hubConnection?.invoke('ToggleInput', circuitId, nodeId, value);
  }

  async sendCursorPosition(circuitId: string, x: number, y: number, userName: string): Promise<void> {
    if (!this.isConnected()) return;
    await this.hubConnection?.invoke('SendCursorPosition', circuitId, x, y, userName);
  }

  onJoinedCircuit(callback: (data: { assignedName: string; circuit: any }) => void): void {
    this.hubConnection?.on('JoinedCircuit', callback);
  }

  onUserJoined(callback: (user: any) => void): void {
    this.hubConnection?.on('UserJoined', callback);
  }

  onUserLeft(callback: (connectionId: string) => void): void {
    this.hubConnection?.on('UserLeft', callback);
  }

  onNodesUpdated(callback: (nodes: CircuitNode[]) => void): void {
    this.hubConnection?.on('NodesUpdated', callback);
  }

  onEdgesUpdated(callback: (edges: CircuitEdge[]) => void): void {
    this.hubConnection?.on('EdgesUpdated', callback);
  }

  onSignalStateUpdated(callback: (states: Record<string, boolean>) => void): void {
    this.hubConnection?.on('SignalStateUpdated', callback);
  }

  onCursorMoved(callback: (data: { connectionId: string; x: number; y: number, userName: string }) => void): void {
    this.hubConnection?.on('CursorMoved', callback);
  }

  unsubscribeAll(): void {
    this.hubConnection?.off('JoinedCircuit');
    this.hubConnection?.off('UserJoined');
    this.hubConnection?.off('UserLeft');
    this.hubConnection?.off('NodesUpdated');
    this.hubConnection?.off('EdgesUpdated');
    this.hubConnection?.off('SignalStateUpdated');
    this.hubConnection?.off('CursorMoved');
  }
}

export const circuitSignalRService = new CircuitSignalRService();