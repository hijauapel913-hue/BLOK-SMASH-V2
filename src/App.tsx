/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Star, Info, Settings, HelpCircle, Zap } from 'lucide-react';
import { GRID_SIZE, generatePiece, BLOCK_STYLES } from './constants';
import { CellValue, PieceData, GameState } from './types';
import { createEmptyGrid, canPlacePiece, placePiece, checkLines, isGameOver } from './lib/gameLogic';
import { PieceView } from './components/PieceView';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHighScore = localStorage.getItem('block_blast_highscore');
    return {
      grid: createEmptyGrid(),
      score: 0,
      highScore: savedHighScore ? parseInt(savedHighScore) : 0,
      availablePieces: [generatePiece(), generatePiece(), generatePiece()],
      isGameOver: false,
    };
  });

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState.score > gameState.highScore) {
      setGameState(prev => ({ ...prev, highScore: gameState.score }));
      localStorage.setItem('block_blast_highscore', gameState.score.toString());
    }
  }, [gameState.score, gameState.highScore]);

  const resetGame = () => {
    setGameState({
      grid: createEmptyGrid(),
      score: 0,
      highScore: gameState.highScore,
      availablePieces: [generatePiece(), generatePiece(), generatePiece()],
      isGameOver: false,
    });
  };

  const handleDragEnd = useCallback((event: any, info: any, piece: PieceData) => {
    setActiveDragId(null);
    if (!gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / GRID_SIZE;

    const pieceWidth = piece.shape[0].length * cellSize;
    const pieceHeight = piece.shape.length * cellSize;

    const dropX = info.point.x - gridRect.left - pieceWidth / 2;
    const dropY = info.point.y - gridRect.top - pieceHeight / 2;

    const gridCol = Math.round(dropX / cellSize);
    const gridRow = Math.round(dropY / cellSize);

    if (canPlacePiece(gameState.grid, piece, gridRow, gridCol)) {
      const placedGrid = placePiece(gameState.grid, piece, gridRow, gridCol);
      const { newGrid, linesCleared } = checkLines(placedGrid);
      
      const newScore = gameState.score + (piece.shape.flat().filter(h => h === 1).length) + (linesCleared * 100 * (linesCleared > 1 ? linesCleared : 1));
      
      let newPieces = gameState.availablePieces.filter(p => p.id !== piece.id);
      if (newPieces.length === 0) {
        newPieces = [generatePiece(), generatePiece(), generatePiece()];
      }

      setGameState(prev => {
        const nextState = {
          ...prev,
          grid: newGrid,
          score: newScore,
          availablePieces: newPieces,
        };

        if (isGameOver(newGrid, newPieces)) {
          return { ...nextState, isGameOver: true };
        }
        return nextState;
      });
    }
  }, [gameState, setGameState]);

  return (
    <div className="game-container bg-slate-950 text-white font-sans overflow-hidden flex flex-col h-screen">
      {/* Header Section */}
      <header className="flex justify-between items-center px-6 sm:px-12 py-6 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
              <div className="w-2 h-2 bg-white rounded-sm"></div>
              <div className="w-2 h-2 bg-white rounded-sm"></div>
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight italic hidden sm:block">BLOCK <span className="text-indigo-400">BLAST</span> PRO</h1>
        </div>
        <div className="flex gap-4 sm:gap-8">
          <div className="text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-semibold">Score</p>
            <p className="text-xl sm:text-2xl font-black text-white">{gameState.score}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-semibold">Best</p>
            <p className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">{gameState.highScore}</p>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16 p-4 overflow-y-auto">
        {/* Left Sidebar: Progress & Level (only on desktop/large) */}
        <div className="hidden lg:flex flex-col w-48 space-y-6">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" /> LVL {Math.floor(gameState.score / 1000) + 1}
            </p>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(gameState.score % 1000) / 10}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right italic font-mono">{gameState.score % 1000} / 1000 XP</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold">Daily Streak</p>
            <div className="flex justify-center gap-1">
              <div className="w-6 h-6 bg-orange-500 rounded-full border border-orange-400/50 shadow-lg shadow-orange-500/40"></div>
              <div className="w-6 h-6 bg-orange-500 rounded-full border border-orange-400/50 shadow-lg shadow-orange-500/40"></div>
              <div className="w-6 h-6 bg-orange-500/20 border border-orange-500/40 rounded-full"></div>
              <div className="w-6 h-6 bg-orange-500/20 border border-orange-500/40 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Central Game Board */}
        <div className="relative p-2 h-fit sm:p-4 bg-slate-800 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/5">
          <div 
            ref={gridRef}
            className="grid grid-cols-8 grid-rows-8 gap-1 w-[320px] h-[320px] sm:w-[440px] sm:h-[440px]"
          >
            {gameState.grid.map((row, rIdx) => 
              row.map((cell, cIdx) => {
                const style = cell ? BLOCK_STYLES[cell] : null;
                return (
                  <div 
                    key={`grid-${rIdx}-${cIdx}`}
                    className={`rounded-sm transition-all duration-300 ${cell ? `${style?.bg} border-b-4 ${style?.border} scale-100` : 'bg-slate-900/50 hover:bg-slate-900/80'}`}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar / Bottom Pieces Container */}
        <div className="flex flex-col gap-6 items-center">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold text-center">Next Pieces</p>
          
          <div className="flex lg:flex-col gap-4 sm:gap-6 bg-slate-900/50 p-6 rounded-[32px] border border-white/5">
            {gameState.availablePieces.map((piece) => (
              <div key={piece.id} className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-2 hover:border-indigo-500 transition-colors">
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.1}
                  onDragStart={() => setActiveDragId(piece.id)}
                  onDragEnd={(e, info) => handleDragEnd(e, info, piece)}
                  whileDrag={{ 
                    scale: 1.1, 
                    zIndex: 50,
                    cursor: 'grabbing'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: activeDragId === piece.id ? 1.1 : 0.8, 
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                  className="cursor-grab touch-none"
                >
                  <PieceView piece={piece} />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-4 sm:px-12 sm:py-6 bg-slate-900/50 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex gap-4">
           <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors flex items-center gap-2">
             <Settings size={14} /> Settings
           </button>
           <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors flex items-center gap-2">
             <HelpCircle size={14} /> Help
           </button>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
           <div className="hidden sm:flex flex-col items-end">
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Daily Quest</p>
             <p className="text-xs text-indigo-300 font-medium">Clear 20 Vertical Lines (12/20)</p>
           </div>
           <button 
            onClick={resetGame}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 text-sm uppercase tracking-tighter"
           >
            RESTART GAME
           </button>
        </div>
      </footer>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 p-10 rounded-[48px] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] text-center flex flex-col items-center gap-6 max-w-sm w-full"
            >
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-2">
                <Trophy size={48} />
              </div>
              <h2 className="text-4xl font-black tracking-tight italic">BLAST OVER</h2>
              <div className="w-full h-[1px] bg-white/5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold opacity-40 uppercase tracking-[0.2em]">Final Score</span>
                <span className="text-6xl font-black text-indigo-400 font-mono tracking-tighter">{gameState.score}</span>
              </div>
              <div className="w-full h-[1px] bg-white/5" />
              <button 
                onClick={resetGame}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 px-8 rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3 italic tracking-tight"
              >
                <RefreshCw size={24} /> TRY AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
