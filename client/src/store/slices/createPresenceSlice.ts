import type { StateCreator } from 'zustand';
import { circuitService } from '../../services/circuitService';
import type { CircuitState, PresenceSlice } from '../types';

export const createPresenceSlice: StateCreator<CircuitState, [], [], PresenceSlice> = (set, get) => ({
  cursors: {},

  sendCursor: (x, y) => {
    const { circuitId, userName } = get();
    if (circuitId) {
      circuitService.sendCursorPosition(circuitId, x, y, userName);
    }
  },

  updateCursor: (connectionId, x, y, userName) => {
    set((state) => ({
      cursors: { ...state.cursors, [connectionId]: { x, y, userName } },
    }));
  },

  removeCursor: (connectionId) => {
    set((state) => {
      const newCursors = { ...state.cursors };
      delete newCursors[connectionId];
      return { cursors: newCursors };
    });
  },

  clearCursors: () => set({ cursors: {} }),
});