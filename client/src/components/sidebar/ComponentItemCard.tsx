import React from 'react';
import type { ComponentConfig } from '../../constants/circuitComponents';

interface ComponentItemCardProps {
  item: ComponentConfig;
}

export const ComponentItemCard: React.FC<ComponentItemCardProps> = ({ item }) => {
  const Icon = item.icon;

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', item.type);
    event.dataTransfer.setData('text/plain', item.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg cursor-grab active:cursor-grabbing transition-all group"
    >
      <div className="p-2 rounded-md bg-slate-900 border border-slate-700/50 group-hover:border-slate-600">
        <Icon className={`w-5 h-5 ${item.colorClass}`} />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-200 group-hover:text-white">
          {item.label}
        </div>
        <div className="text-xs text-slate-400">
          {item.description}
        </div>
      </div>
    </div>
  );
};