import React, { useState, useEffect } from 'react';
import { Plus, Users, Cpu } from 'lucide-react';
import { useCircuitStore } from '../store/useCircuitStore';
import { CircuitBackground } from '../components/background/CircuitBackground';

interface CircuitInfo {
  id: string;
  name: string;
  createdBy: string;
  activeUsersCount: number;
}

export const LobbyPage: React.FC = () => {
  const { setUserName, initConnection } = useCircuitStore();

  const [inputName, setInputName] = useState('');
  const [circuitName, setCircuitName] = useState('');
  const [circuits, setCircuits] = useState<CircuitInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCircuits = async () => {
    try {
      const res = await fetch('/api/circuits');
      if (res.ok) {
        const data = await res.json();
        setCircuits(data);
      }
    } catch (e) {
      console.error('Failed to fetch circuits:', e);
    }
  };

  useEffect(() => {
    fetchCircuits();
    const interval = setInterval(fetchCircuits, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateCircuit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !circuitName.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/circuits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: circuitName, createdBy: inputName }),
      });

      if (res.ok) {
        const newCircuit = await res.json();
        setUserName(inputName);
        await initConnection(newCircuit.id, inputName);
      }
    } catch (e) {
      console.error('Error creating circuit:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCircuit = async (id: string) => {
    if (!inputName.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      setUserName(inputName);
      await initConnection(id, inputName);
    } catch (e) {
      console.error('Error joining circuit:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-slate-950 p-4">
      <CircuitBackground />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/80 p-15 shadow-2xl backdrop-blur-md">
        <div className="mb-7 flex items-center gap-3">
          <div className="relative rounded-lg bg-blue-600/20 p-2.5 border border-blue-500/30">
            <Cpu className="h-6 w-6 text-blue-400" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Logic Circuit Editor
            </h1>
            <p className="text-xs text-slate-400">Create and edit logic circuits</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Your name
            </label>
            <input
              type="text"
              placeholder="Example: John"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="pt-5 border-t border-slate-800">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Create new circuit
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Circuit name"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                onClick={handleCreateCircuit}
                disabled={isLoading || !inputName.trim() || !circuitName.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
              >
                <Plus className="h-4 w-4" />
                Create
              </button>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800">
            <div className="flex items-baseline justify-between mb-2.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active circuits
              </label>
              <span className="text-xs font-medium text-slate-500 tabular-nums">
                {circuits.length}
              </span>
            </div>
            <div className="max-h-52 overflow-y-auto space-y-2 custom-scrollbar pr-1">
              {circuits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="rounded-full bg-slate-800/60 p-2 mb-2">
                    <Cpu className="h-4 w-4 text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-500">No active circuits</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Be the first to create one
                  </p>
                </div>
              ) : (
                circuits.map((c) => (
                  <div
                    key={c.id}
                    className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700 hover:bg-slate-950/80 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-200 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        by {c.createdBy}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="flex items-center gap-1 text-xs text-slate-400 tabular-nums">
                        <Users className="h-3.5 w-3.5" />
                        {c.activeUsersCount}
                      </span>
                      <button
                        onClick={() => handleJoinCircuit(c.id)}
                        disabled={isLoading || !inputName.trim()}
                        className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-slate-800 disabled:hover:text-slate-200 transition-colors"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};