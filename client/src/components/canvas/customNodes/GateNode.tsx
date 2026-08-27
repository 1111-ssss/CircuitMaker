import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CIRCUIT_COMPONENTS } from '../../../constants/circuitComponents';

const GATE_CONFIG_MAP = Object.fromEntries(
  CIRCUIT_COMPONENTS.map((comp) => [comp.type, comp])
);

export const GateNode: React.FC<NodeProps> = ({ type, data, selected }) => {
  const config = GATE_CONFIG_MAP[type || 'andGate'] || GATE_CONFIG_MAP.andGate;
  const Icon = config.icon;
  const isActive = Boolean(data.value);

  return (
    <div
      className={`relative min-w-[110px] rounded-xl border bg-slate-900 p-5 shadow-lg transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {config.isSingleInput ? (
        <Handle
          type="target"
          position={Position.Left}
          id="in_a"
          style={{ top: '50%' }}
          className="!h-3 !w-3 !border-2 !border-slate-900 !bg-slate-700"
        />
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="in_a"
            style={{ top: '25%' }}
            className="!h-3 !w-3 !border-2 !border-slate-900 !bg-slate-700"
          />
          <Handle
            type="target"
            position={Position.Left}
            id="in_b"
            style={{ top: '75%' }}
            className="!h-3 !w-3 !border-2 !border-slate-900 !bg-slate-700"
          />
        </>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className={`flex items-center gap-1.5 rounded-lg border bg-slate-950 px-2 py-1 text-xs font-semibold ${config.colorClass} ${config.borderClass}`}>
          <Icon className="h-5 w-4" />
          <span>{config.label.replace(' Gate', '')}</span>
        </div>
        <span className={`font-mono text-xs font-bold ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
          {isActive ? '1' : '0'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{ top: '50%' }}
        className={`!h-3 !w-3 !border-2 !border-slate-900 !bg-slate-700 transition-colors ${
          isActive ? '!bg-emerald-400 shadow-[0_0_8px_#10b981]' : ''
        }`}
      />
    </div>
  );
};