import React from 'react';
import { MoodRegion, MOOD_COLORS, GRID_SIZE, DIR_OFFSETS } from '../utils/constants';

interface MoodGlowProps {
  regions: MoodRegion[];
  cellSize: number;
  gap: number;
}

interface Edge {
  x: number;
  y: number;
  side: number;
}

function getRegionEdges(region: MoodRegion): Edge[] {
  const cellSet = new Set(region.cells.map((c) => `${c.x},${c.y}`));
  const edges: Edge[] = [];

  for (const cell of region.cells) {
    for (let dir = 0; dir < 4; dir++) {
      const [dx, dy] = DIR_OFFSETS[dir];
      const nx = cell.x + dx;
      const ny = cell.y + dy;
      if (!cellSet.has(`${nx},${ny}`)) {
        edges.push({ x: cell.x, y: cell.y, side: dir });
      }
    }
  }

  return edges;
}

export const MoodGlow: React.FC<MoodGlowProps> = ({ regions, cellSize, gap }) => {
  const totalSize = GRID_SIZE * cellSize + (GRID_SIZE - 1) * gap + 16;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ padding: '8px' }}
    >
      {regions.map((region, regionIndex) => {
        const color = MOOD_COLORS[region.mood];
        const edges = getRegionEdges(region);

        return (
          <div key={regionIndex} className="absolute inset-0" style={{ padding: '8px' }}>
            {edges.map((edge, edgeIndex) => {
              const offset = cellSize + gap;
              const baseX = edge.x * offset;
              const baseY = edge.y * offset;

              let style: React.CSSProperties = {};

              switch (edge.side) {
                case 0:
                  style = {
                    left: baseX,
                    top: baseY - 2,
                    width: cellSize,
                    height: 4,
                  };
                  break;
                case 1:
                  style = {
                    left: baseX + cellSize - 2,
                    top: baseY,
                    width: 4,
                    height: cellSize,
                  };
                  break;
                case 2:
                  style = {
                    left: baseX,
                    top: baseY + cellSize - 2,
                    width: cellSize,
                    height: 4,
                  };
                  break;
                case 3:
                  style = {
                    left: baseX - 2,
                    top: baseY,
                    width: 4,
                    height: cellSize,
                  };
                  break;
              }

              return (
                <div
                  key={edgeIndex}
                  className="absolute rounded-full mood-light-band"
                  style={{
                    ...style,
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}, 0 0 24px ${color}40`,
                    opacity: 0.8,
                  }}
                />
              );
            })}

            {region.cells.map((cell, cellIndex) => {
              const offset = cellSize + gap;
              const baseX = cell.x * offset;
              const baseY = cell.y * offset;

              return (
                <div
                  key={`glow-${cellIndex}`}
                  className="absolute mood-cell-glow"
                  style={{
                    left: baseX,
                    top: baseY,
                    width: cellSize,
                    height: cellSize,
                    background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                    borderRadius: '8px',
                  }}
                />
              );
            })}
          </div>
        );
      })}

      <style>{`
        @keyframes mood-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes mood-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .mood-light-band {
          animation: mood-pulse 2s ease-in-out infinite;
        }
        .mood-cell-glow {
          animation: mood-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
