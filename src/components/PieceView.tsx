import { motion } from 'motion/react';
import { PieceData } from '../types';
import { BLOCK_STYLES } from '../constants';

interface PieceViewProps {
  piece: PieceData;
  scale?: number;
}

export const PieceView = ({ piece, scale = 1 }: PieceViewProps) => {
  const style = BLOCK_STYLES[piece.color] || { bg: 'bg-indigo-500', border: 'border-indigo-700' };

  return (
    <div
      className="grid gap-[2px] sm:gap-[3px]"
      style={{
        gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`,
        gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
      }}
    >
      {piece.shape.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className={`w-5 h-5 sm:w-7 sm:h-7 rounded-sm ${
              cell === 1 ? style.bg : 'bg-transparent'
            } ${cell === 1 ? `border-b-4 ${style.border} shadow-sm` : ''}`}
            style={{
              opacity: cell === 1 ? 1 : 0,
              transform: `scale(${scale})`,
            }}
          />
        ))
      )}
    </div>
  );
};
