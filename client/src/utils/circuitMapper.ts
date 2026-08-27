import { type Node, type Edge } from '@xyflow/react';
import { type CircuitNode, type CircuitEdge } from '../api/circuitApi';

export function mapApiNodeToReactFlow(apiNode: CircuitNode): Node {
  return {
    id: apiNode.id,
    type: apiNode.type,
    position: {
      x: apiNode.x,
      y: apiNode.y,
    },
    data: {
      label: apiNode.type,
      ...(apiNode.state || {}),
    },
  };
}

export function mapReactFlowNodeToApi(node: Node): CircuitNode {
  const { label, ...state } = node.data || {};
  return {
    id: node.id,
    type: node.type || 'default',
    x: node.position.x,
    y: node.position.y,
    state: state as Record<string, unknown>,
  };
}

export function mapApiEdgeToReactFlow(apiEdge: CircuitEdge): Edge {
  return {
    id: apiEdge.id,
    source: apiEdge.sourceNodeId,
    target: apiEdge.targetNodeId,
    sourceHandle: apiEdge.sourceHandle || undefined,
    targetHandle: apiEdge.targetHandle || undefined,
  };
}

export function mapReactFlowEdgeToApi(edge: Edge): CircuitEdge {
  return {
    id: edge.id,
    sourceNodeId: edge.source,
    targetNodeId: edge.target,
    sourceHandle: edge.sourceHandle || '',
    targetHandle: edge.targetHandle || '',
  };
}