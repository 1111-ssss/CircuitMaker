import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export const OutputNode: React.FC<NodeProps> = ({ data, selected }) => {
  const isActive = Boolean(data.value);

  return (
    <div
      className={`relative min-w-[120px] rounded-xl border bg-slate-900 p-3 shadow-lg transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className={`!h-3 !w-3 !border-2 !border-slate-900 !bg-slate-700 transition-colors ${
          isActive ? '!bg-emerald-400 shadow-[0_0_8px_#10b981]' : ''
        }`}
      />

      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Output</span>
        <div
          className={`h-3 w-3 rounded-full transition-all ${
            isActive
              ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
              : 'bg-slate-800 border border-slate-700'
          }`}
        />
      </div>

      <div
        className={`flex items-center justify-center rounded-lg py-2 border transition-all ${
          isActive
            ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
            : 'border-slate-800 bg-slate-950 text-slate-600'
        }`}
      >
        <span className="font-mono text-sm font-bold">
          {isActive ? 'ON (1)' : 'OFF (0)'}
        </span>
      </div>
    </div>
  );
};