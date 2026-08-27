import React, { useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useReactFlow,
  ViewportPortal,
  type Connection,
  type Edge,
  type Node,
  type EdgeChange
} from '@xyflow/react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { InputNode } from './customNodes/InputNode';
import { OutputNode } from './customNodes/OutputNode';
import { GateNode } from './customNodes/GateNode';
import { MousePointer2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';

const TRAY_WIDTH = 260;

const NODE_TYPES = {
  inputNode: InputNode,
  outputNode: OutputNode,
  andGate: GateNode,
  orGate: GateNode,
  notGate: GateNode,
  xorGate: GateNode,
  nandGate: GateNode,
  norGate: GateNode,
};

const DEFAULT_EDGE_OPTIONS = {
  animated: true,
  style: { stroke: '#6366f1', strokeWidth: 2 },
};

export const CircuitCanvas: React.FC = () => {
  const { 
    nodes, 
    edges, 
    cursors,
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    sendCursor 
  } = useCircuitStore();

  const { screenToFlowPosition } = useReactFlow();
  const lastCursorSendRef = useRef<number>(0);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const changes: EdgeChange[] = [
        { id: oldEdge.id, type: 'remove' },
        { 
          type: 'add', 
          item: { 
            ...oldEdge, 
            ...newConnection, 
            id: `e_${newConnection.source}-${newConnection.target}` 
          } 
        }
      ];
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      onEdgesChange([{ id: edge.id, type: 'remove' }]);
    },
    [onEdgesChange]
  );

  const onNodeDragStop = useCallback(
    (event: MouseEvent | TouchEvent, node: Node) => {
      const clientX = 'clientX' in event 
        ? event.clientX 
        : event.changedTouches?.[0]?.clientX ?? 0;

      if (clientX <= TRAY_WIDTH) {
        onNodesChange([{ id: node.id, type: 'remove' }]);
      }
    },
    [onNodesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = 
        event.dataTransfer.getData('application/reactflow') || 
        event.dataTransfer.getData('text/plain');

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: type, value: false },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const handlePaneMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastCursorSendRef.current > 30) {
        lastCursorSendRef.current = now;
        
        const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });

        sendCursor(pos.x, pos.y);
      }
    },
    [screenToFlowPosition, sendCursor]
  );

  return (
    <div 
      className="h-full w-full bg-slate-950 relative overflow-hidden" 
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPointerMove={handlePaneMouseMove}
        colorMode="dark"
        
        onReconnect={onReconnect}
        onReconnectEnd={onReconnectEnd}
        reconnectRadius={25}
        
        onNodeDragStop={onNodeDragStop}
        deleteKeyCode={['Delete', 'Backspace']}
        
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
      >
        <Background gap={20} color="#334155" />
        <Controls />
        <MiniMap 
          nodeColor="#64748b" 
          maskColor="rgba(15, 23, 42, 0.7)"
        />

        <ViewportPortal>
          {Object.entries(cursors).map(([connectionId, pos]) => (
            <div
              key={connectionId}
              className="pointer-events-none absolute left-0 top-0 z-50 flex items-center gap-1 transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <MousePointer2 className="h-4 w-4 text-emerald-400 fill-emerald-400 drop-shadow" />
              <span className="rounded bg-emerald-950/90 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/30 shadow-md whitespace-nowrap">
                {pos.userName || connectionId.slice(0, 5)}
              </span>
            </div>
          ))}
        </ViewportPortal>
      </ReactFlow>
    </div>
  );
};