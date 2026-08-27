import type { StateCreator } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { circuitService } from '../../services/circuitService';
import { mapReactFlowNodeToApi, mapReactFlowEdgeToApi } from '../../utils/circuitMapper';
import type { CircuitState, CircuitFlowSlice } from '../types';

export const createCircuitFlowSlice: StateCreator<CircuitState, [], [], CircuitFlowSlice> = (set, get) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    const nextNodes = applyNodeChanges(changes, get().nodes);
    const circuitId = get().circuitId;

    set({ nodes: nextNodes });

    const shouldSync = changes.some(
      (change) =>
        change.type === 'remove' ||
        (change.type === 'position' && !change.dragging)
    );

    if (shouldSync && circuitId) {
      circuitService.updateNodes(circuitId, nextNodes.map(mapReactFlowNodeToApi));

      if (changes.some((c) => c.type === 'remove')) {
        const activeNodeIds = new Set(nextNodes.map((node) => node.id));
        const nextEdges = get().edges.filter(
          (edge) => activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target)
        );
        set({ edges: nextEdges });
        circuitService.updateEdges(circuitId, nextEdges.map(mapReactFlowEdgeToApi));
      }
    }
  },

  onEdgesChange: (changes) => {
    const nextEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: nextEdges });

    const circuitId = get().circuitId;
    const shouldSync = changes.some((change) => change.type === 'remove');

    if (shouldSync && circuitId) {
      circuitService.updateEdges(circuitId, nextEdges.map(mapReactFlowEdgeToApi));
    }
  },

  onConnect: (connection) => {
    const nextEdges = addEdge(connection, get().edges);
    set({ edges: nextEdges });

    const circuitId = get().circuitId;
    if (circuitId) {
      circuitService.updateEdges(circuitId, nextEdges.map(mapReactFlowEdgeToApi));
    }
  },

  addNode: (newNode) => {
    const nextNodes = [...get().nodes, newNode];
    set({ nodes: nextNodes });

    const circuitId = get().circuitId;
    if (circuitId) {
      circuitService.updateNodes(circuitId, nextNodes.map(mapReactFlowNodeToApi));
    }
  },

  toggleInputNode: (nodeId, currentValue) => {
    const circuitId = get().circuitId;

    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, value: !currentValue } }
          : node
      ),
    }));

    if (circuitId) {
      circuitService.toggleInput(circuitId, nodeId, !currentValue);
    }
  },
});