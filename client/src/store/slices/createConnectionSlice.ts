import type { StateCreator } from 'zustand';
import { circuitService } from '../../services/circuitService';
import { mapApiNodeToReactFlow, mapApiEdgeToReactFlow } from '../../utils/circuitMapper';
import type { CircuitState, ConnectionSlice } from '../types';

export const createConnectionSlice: StateCreator<CircuitState, [], [], ConnectionSlice> = (set, get) => ({
    circuitId: null,
    userName: '',

    setUserName: (userName: string) => set({ userName }),

    initConnection: async (circuitId: string, userName: string) => {
        set({ circuitId, userName });
        await circuitService.connectHub();

        circuitService.unsubscribeAll();

        circuitService.onJoinedCircuit((result: any) => {
            const assignedName = result?.assignedName || result?.AssignedName || userName;
            set({ userName: assignedName });

            const rawCircuit = result?.circuit || result?.Circuit || result?.value || result?.Value;
            if (rawCircuit) {
                const mappedNodes = (rawCircuit.nodes || rawCircuit.Nodes || []).map(mapApiNodeToReactFlow);
                const mappedEdges = (rawCircuit.edges || rawCircuit.Edges || []).map(mapApiEdgeToReactFlow);
                set({ nodes: mappedNodes, edges: mappedEdges });
            }
        });

        circuitService.onNodesUpdated((apiNodes) => {
            const incomingNodes = (apiNodes || []).map(mapApiNodeToReactFlow);

            set((state) => {
                const draggingNodesMap = new Map(
                    state.nodes
                        .filter((n) => n.selected || n.dragging)
                        .map((n) => [n.id, n])
                );

                const mergedNodes = incomingNodes.map((incNode) => {
                    const localNode = draggingNodesMap.get(incNode.id);
                    if (localNode) {
                        return { ...incNode, position: localNode.position, selected: true };
                    }
                    return incNode;
                });

                return { nodes: mergedNodes };
            });
        });

        circuitService.onEdgesUpdated((apiEdges) => {
            set({ edges: (apiEdges || []).map(mapApiEdgeToReactFlow) });
        });

        circuitService.onSignalStateUpdated((signalStates) => {
            set((state) => ({
                nodes: state.nodes.map((node) =>
                    signalStates[node.id] !== undefined
                        ? { ...node, data: { ...node.data, value: signalStates[node.id] } }
                        : node
                ),
            }));
        });

        circuitService.onCursorMoved(({ connectionId, x, y, userName: remoteUserName }) => {
            get().updateCursor(connectionId, x, y, remoteUserName);
        });

        circuitService.onUserLeft((connectionId) => {
            get().removeCursor(connectionId);
        });

        await circuitService.joinCircuit(circuitId, userName);
    },

    leaveRoom: async () => {
        circuitService.unsubscribeAll();
        await circuitService.disconnectHub();
        get().clearCursors();
        set({ circuitId: null, nodes: [], edges: [] });
    },
});