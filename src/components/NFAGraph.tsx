import React from 'react';
import { NFA, NFANodePosition } from '@/lib/nfa-types';

interface NFAGraphProps {
  nfa: NFA;
  positions: NFANodePosition[];
  activeStates?: Set<string>;
  highlightTransition?: { from: string; to: string; symbol: string } | null;
}

const NFAGraph: React.FC<NFAGraphProps> = ({ nfa, positions, activeStates, highlightTransition }) => {
  const width = 530;
  const height = 360;
  const nodeRadius = 28;

  const posMap = new Map(positions.map(p => [p.id, p]));

  const getPos = (id: string) => posMap.get(id) || { x: 0, y: 0 };

  // Collect all edges for rendering
  const edges: { from: string; to: string; symbols: string[] }[] = [];
  const edgeMap = new Map<string, string[]>();

  for (const state of nfa.states) {
    const trans = nfa.transitions[state];
    if (!trans) continue;
    for (const [symbol, targets] of Object.entries(trans)) {
      for (const target of targets) {
        const key = `${state}->${target}`;
        if (!edgeMap.has(key)) {
          edgeMap.set(key, []);
          edges.push({ from: state, to: target, symbols: edgeMap.get(key)! });
        }
        edgeMap.get(key)!.push(symbol);
      }
    }
  }

  const isActive = (state: string) => activeStates?.has(state);
  const isAccept = (state: string) => nfa.acceptStates.includes(state);
  const isStart = (state: string) => state === nfa.startState;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto" style={{ maxHeight: 360 }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Start arrow */}
      {(() => {
        const startPos = getPos(nfa.startState);
        return (
          <line
            x1={startPos.x - 55}
            y1={startPos.y}
            x2={startPos.x - nodeRadius - 2}
            y2={startPos.y}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
          />
        );
      })()}

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = getPos(edge.from);
        const to = getPos(edge.to);
        const isHighlighted = highlightTransition &&
          highlightTransition.from === edge.from &&
          highlightTransition.to === edge.to;
        const isSelfLoop = edge.from === edge.to;

        if (isSelfLoop) {
          const cx = from.x;
          const cy = from.y - nodeRadius - 20;
          return (
            <g key={i}>
              <path
                d={`M ${from.x - 12} ${from.y - nodeRadius} C ${cx - 30} ${cy - 20}, ${cx + 30} ${cy - 20}, ${from.x + 12} ${from.y - nodeRadius}`}
                fill="none"
                stroke={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                className="transition-all duration-300"
              />
              <text
                x={cx}
                y={cy - 18}
                textAnchor="middle"
                fill={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
                fontSize={13}
                fontFamily="'JetBrains Mono', monospace"
                className="transition-all duration-300"
              >
                {edge.symbols.join(', ')}
              </text>
            </g>
          );
        }

        // Check for reverse edge to offset
        const reverseExists = edges.some(e => e.from === edge.to && e.to === edge.from);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;
        const offset = reverseExists ? 12 : 0;

        const x1 = from.x + (dx / len) * (nodeRadius + 2) + nx * offset;
        const y1 = from.y + (dy / len) * (nodeRadius + 2) + ny * offset;
        const x2 = to.x - (dx / len) * (nodeRadius + 12) + nx * offset;
        const y2 = to.y - (dy / len) * (nodeRadius + 12) + ny * offset;

        const midX = (x1 + x2) / 2 + nx * 14;
        const midY = (y1 + y2) / 2 + ny * 14;

        return (
          <g key={i}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              className="transition-all duration-300"
            />
            <text
              x={midX} y={midY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
              fontSize={13}
              fontFamily="'JetBrains Mono', monospace"
              className="transition-all duration-300"
            >
              {edge.symbols.join(', ')}
            </text>
          </g>
        );
      })}

      {/* Nodes */}
      {nfa.states.map(state => {
        const pos = getPos(state);
        const active = isActive(state);
        const accept = isAccept(state);

        return (
          <g key={state} filter={active ? 'url(#glow)' : undefined}>
            {/* Accept state outer circle */}
            {accept && (
              <circle
                cx={pos.x} cy={pos.y} r={nodeRadius + 5}
                fill="none"
                stroke={active ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))'}
                strokeWidth={2}
                className="transition-all duration-300"
              />
            )}
            <circle
              cx={pos.x} cy={pos.y} r={nodeRadius}
              fill={active ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--secondary))'}
              stroke={active ? 'hsl(var(--primary))' : accept ? 'hsl(var(--muted-foreground))' : 'hsl(var(--border))'}
              strokeWidth={active ? 2.5 : 2}
              className="transition-all duration-300"
            />
            <text
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={active ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
              fontSize={14}
              fontWeight={600}
              fontFamily="'JetBrains Mono', monospace"
              className="transition-all duration-300"
            >
              {state}
            </text>
            {isStart(state) && (
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 16}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize={10}
              >
                start
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default NFAGraph;
