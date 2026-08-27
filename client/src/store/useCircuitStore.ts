import { create } from 'zustand';
import type { CircuitState } from './types';
import { createConnectionSlice } from './slices/createConnectionSlice';
import { createCircuitFlowSlice } from './slices/createCircuitFlowSlice';
import { createPresenceSlice } from './slices/createPresenceSlice';

export const useCircuitStore = create<CircuitState>()((...a) => ({
  ...createConnectionSlice(...a),
  ...createCircuitFlowSlice(...a),
  ...createPresenceSlice(...a),
}));

export type { CircuitState };