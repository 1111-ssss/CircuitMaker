import React, { useMemo } from 'react';

export const CircuitBackground: React.FC = () => {
  const { paths, chips, capacitors, resistors, nodes, pulseNodes } = useMemo(() => {
    const cols = 24;
    const rows = 18;
    const generatedNodes: { x: number; y: number; key: string; type: 'node' | 'chip' | 'capacitor' | 'resistor' }[] = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / (cols - 1)) * 100;
        const y = (r / (rows - 1)) * 100;
        const key = `${r}-${c}`;
        
        const rand = Math.random();
        let type: 'node' | 'chip' | 'capacitor' | 'resistor' = 'node';
        
        if (rand > 0.98) {
          type = 'chip';
        } else if (rand > 0.96) {
          type = 'capacitor';
        } else if (rand > 0.94) {
          type = 'resistor';
        }
        
        generatedNodes.push({ x, y, key, type });
      }
    }

    const generatedPaths: { d: string; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const node = generatedNodes[idx];
        
        if (c < cols - 1) {
          const right = generatedNodes[idx + 1];
          if (node.type === 'node' && right.type === 'node') {
            generatedPaths.push({
              d: `M ${node.x} ${node.y} L ${right.x} ${right.y}`,
              key: `h-${r}-${c}`,
            });
          }
        }
        
        if (r < rows - 1) {
          const bottom = generatedNodes[idx + cols];
          if (node.type === 'node' && bottom.type === 'node') {
            generatedPaths.push({
              d: `M ${node.x} ${node.y} L ${bottom.x} ${bottom.y}`,
              key: `v-${r}-${c}`,
            });
          }
        }
      }
    }

    const generatedChips = generatedNodes.filter((n) => n.type === 'chip');
    const generatedCapacitors = generatedNodes.filter((n) => n.type === 'capacitor');
    const generatedResistors = generatedNodes.filter((n) => n.type === 'resistor');
    
    const generatedPulseNodes = generatedNodes
      .filter((n) => n.type === 'node' && Math.random() > 0.98)
      .slice(0, 6);

    return {
      paths: generatedPaths,
      chips: generatedChips,
      capacitors: generatedCapacitors,
      resistors: generatedResistors,
      nodes: generatedNodes,
      pulseNodes: generatedPulseNodes,
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.12),transparent_70%)]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {paths.map((p) => (
          <path
            key={p.key}
            d={p.d}
            fill="none"
            stroke="url(#traceGrad)"
            strokeWidth="0.08"
          />
        ))}

        {chips.map((chip, i) => {
          const width = 2 + (i % 3) * 0.5;
          const height = 1.5 + (i % 2) * 0.5;
          const pinCount = 3 + (i % 3);
          
          return (
            <g key={chip.key}>
              <rect
                x={chip.x - width / 2}
                y={chip.y - height / 2}
                width={width}
                height={height}
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="0.1"
                opacity="0.6"
              />
              {Array.from({ length: pinCount }).map((_, j) => {
                const offset = ((j / (pinCount - 1)) - 0.5) * (width - 0.4);
                return (
                  <React.Fragment key={j}>
                    <line
                      x1={chip.x + offset}
                      y1={chip.y - height / 2}
                      x2={chip.x + offset}
                      y2={chip.y - height / 2 - 0.4}
                      stroke="#475569"
                      strokeWidth="0.08"
                      opacity="0.5"
                    />
                    <line
                      x1={chip.x + offset}
                      y1={chip.y + height / 2}
                      x2={chip.x + offset}
                      y2={chip.y + height / 2 + 0.4}
                      stroke="#475569"
                      strokeWidth="0.08"
                      opacity="0.5"
                    />
                  </React.Fragment>
                );
              })}
            </g>
          );
        })}

        {capacitors.map((cap) => (
          <g key={cap.key}>
            <line
              x1={cap.x - 0.4}
              y1={cap.y - 0.6}
              x2={cap.x - 0.4}
              y2={cap.y + 0.6}
              stroke="#475569"
              strokeWidth="0.12"
              opacity="0.6"
            />
            <line
              x1={cap.x + 0.4}
              y1={cap.y - 0.6}
              x2={cap.x + 0.4}
              y2={cap.y + 0.6}
              stroke="#475569"
              strokeWidth="0.12"
              opacity="0.6"
            />
          </g>
        ))}

        {resistors.map((res) => {
          const zigzag = `M ${res.x - 0.8} ${res.y} L ${res.x - 0.6} ${res.y - 0.3} L ${res.x - 0.2} ${res.y + 0.3} L ${res.x + 0.2} ${res.y - 0.3} L ${res.x + 0.6} ${res.y + 0.3} L ${res.x + 0.8} ${res.y}`;
          return (
            <path
              key={res.key}
              d={zigzag}
              fill="none"
              stroke="#475569"
              strokeWidth="0.1"
              opacity="0.6"
            />
          );
        })}

        {nodes
          .filter((n) => n.type === 'node')
          .map((n) => (
            <circle
              key={n.key}
              cx={n.x}
              cy={n.y}
              r="0.15"
              fill="#64748b"
              opacity="0.5"
            />
          ))}

        {pulseNodes.map((n, i) => (
          <circle key={`pulse-${i}`} cx={n.x} cy={n.y} r="0.3" fill="#3b82f6">
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};