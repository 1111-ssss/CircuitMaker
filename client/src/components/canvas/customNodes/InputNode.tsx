import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Power } from 'lucide-react';
import { useCircuitStore } from '../../../store/useCircuitStore';

export const InputNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const toggleInputNode = useCircuitStore((s) => s.toggleInputNode);
  const isActive = Boolean(data.value);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleInputNode(id, isActive);
  };

  return (
    <div
      className={`relative min-w-[120px] rounded-xl border bg-slate-900 p-3 shadow-lg transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Input</span>
        <button
          onClick={handleToggle}
          title="Toggle power"
          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
            isActive
              ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'border-slate-700 bg-slate-950 text-slate-500 hover:text-slate-300'
          }`}
        >
          <Power className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-slate-950 px-2.5 py-1.5 border border-slate-800/80">
        <span className="text-xs font-medium text-slate-400">Power: </span>
        <span className={`font-mono text-sm font-bold px-2.5 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
          {isActive ? ' 1 (HIGH)' : ' 0 (LOW)'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!h-3 !w-3 !border-2 !border-slate-900 !bg-slate-700 transition-colors ${
          isActive ? '!bg-emerald-400 shadow-[0_0_8px_#10b981]' : ''
        }`}
      />
    </div>
  );
};