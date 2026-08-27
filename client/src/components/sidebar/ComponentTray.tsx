import React from 'react';
import { CIRCUIT_COMPONENTS } from '../../constants/circuitComponents';
import { ComponentItemCard } from './ComponentItemCard';

export const ComponentTray: React.FC = () => {
  const ioComponents = CIRCUIT_COMPONENTS.filter((c) => c.category === 'io');
  const gateComponents = CIRCUIT_COMPONENTS.filter((c) => c.category === 'gates');

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none z-10 shadow-xl">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Circuit components
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Drag and drop elements
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 mb-2 block">
            Inputs & Outputs
          </span>
          <div className="space-y-2">
            {ioComponents.map((comp) => (
              <ComponentItemCard key={comp.type} item={comp} />
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1 mb-2 block">
            Logic Gates
          </span>
          <div className="space-y-2">
            {gateComponents.map((comp) => (
              <ComponentItemCard key={comp.type} item={comp} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-500 text-center">
        Grid Snap: Active (20px)
      </div>
    </aside>
  );
};