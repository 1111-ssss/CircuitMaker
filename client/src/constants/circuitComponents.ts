import {
  ToggleLeft,
  Lightbulb,
  MinusCircle,
  Ampersand,
  Split,
  SquaresExclude,
  SquaresIntersect,
  CircleOff
} from 'lucide-react';
import React from 'react';

export interface ComponentConfig {
  type: string;
  label: string;
  description: string;
  category: 'io' | 'gates';
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  borderClass: string;
  isSingleInput?: boolean;
}

export const CIRCUIT_COMPONENTS: ComponentConfig[] = [
  {
    type: 'inputNode',
    label: 'Input (0/1)',
    description: 'Switch power',
    category: 'io',
    icon: ToggleLeft,
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  {
    type: 'outputNode',
    label: 'Output (LED)',
    description: 'Signal LED',
    category: 'io',
    icon: Lightbulb,
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  {
    type: 'andGate',
    label: 'AND Gate',
    description: 'Logical AND',
    category: 'gates',
    icon: Ampersand,
    colorClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  {
    type: 'orGate',
    label: 'OR Gate',
    description: 'Logical OR',
    category: 'gates',
    icon: Split,
    colorClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/30',
  },
  {
    type: 'notGate',
    label: 'NOT Gate',
    description: 'Logical NOT',
    category: 'gates',
    icon: MinusCircle,
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    isSingleInput: true,
  },
  {
    type: 'xorGate',
    label: 'XOR Gate',
    description: 'Logical XOR',
    category: 'gates',
    icon: SquaresExclude,
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
  },
  {
    type: 'nandGate',
    label: 'NAND Gate',
    description: 'Logical NAND',
    category: 'gates',
    icon: SquaresIntersect,
    colorClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
  },
  {
    type: 'norGate',
    label: 'NOR Gate',
    description: 'Logical NOR',
    category: 'gates',
    icon: CircleOff,
    colorClass: 'text-teal-400',
    borderClass: 'border-teal-500/30',
  },
];