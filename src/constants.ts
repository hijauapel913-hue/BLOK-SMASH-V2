import { PieceData } from './types';

export const GRID_SIZE = 8;

export const BLOCK_STYLES: Record<string, { bg: string; border: string }> = {
  indigo: { bg: 'bg-indigo-500', border: 'border-indigo-700' },
  pink: { bg: 'bg-pink-500', border: 'border-pink-700' },
  cyan: { bg: 'bg-cyan-500', border: 'border-cyan-700' },
  amber: { bg: 'bg-amber-400', border: 'border-amber-600' },
  lime: { bg: 'bg-lime-500', border: 'border-lime-700' },
  rose: { bg: 'bg-rose-500', border: 'border-rose-700' },
  violet: { bg: 'bg-violet-500', border: 'border-violet-700' },
  emerald: { bg: 'bg-emerald-500', border: 'border-emerald-700' },
};

export const BLOCK_COLORS = Object.keys(BLOCK_STYLES);

export const PIECE_SHAPES = [
  // 1x1
  [[1]],
  // 2x1
  [[1, 1]],
  // 1x2
  [[1], [1]],
  // 3x1
  [[1, 1, 1]],
  // 1x3
  [[1], [1], [1]],
  // 4x1
  [[1, 1, 1, 1]],
  // 1x4
  [[1], [1], [1], [1]],
  // 2x2
  [[1, 1], [1, 1]],
  // 3x3 square (rare but fun)
  [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  // L shapes
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  [[1, 1], [1, 0], [1, 0]],
  [[1, 1], [0, 1], [0, 1]],
  // T shape
  [[1, 1, 1], [0, 1, 0]],
  // Z and S shapes
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];

export const generatePiece = (): PieceData => {
  const shapeIndex = Math.floor(Math.random() * PIECE_SHAPES.length);
  const colorKey = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    shape: PIECE_SHAPES[shapeIndex],
    color: colorKey,
  };
};
