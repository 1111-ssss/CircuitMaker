import React from 'react';
import { LogOut, Cpu } from 'lucide-react';
import { useCircuitStore } from '../store/useCircuitStore';
import { ComponentTray } from '../components/sidebar/ComponentTray';
import { CircuitCanvas } from '../components/canvas/CircuitCanvas';

export const CircuitPage: React.FC = () => {
  const { circuitId, userName, leaveRoom } = useCircuitStore();

  const handleLeave = async () => {
    if (leaveRoom) {
      await leaveRoom();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950">
      <header className="flex h-12 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span>Logic Editor</span>
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400 font-mono">ID: {circuitId}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>You: <strong className="text-white">{userName}</strong></span>
          </div>

          <button
            onClick={handleLeave}
            className="flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-rose-900/50 hover:text-rose-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Leave
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <ComponentTray />
        <main className="flex-1 h-full relative">
          <CircuitCanvas />
        </main>
      </div>
    </div>
  );
};