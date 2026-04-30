import { GRID_SIZE } from '../constants';
import { CellValue, PieceData } from '../types';

export const createEmptyGrid = (): CellValue[][] => {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
};

export const canPlacePiece = (
  grid: CellValue[][],
  piece: PieceData,
  row: number,
  col: number
): boolean => {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] === 1) {
        const gridR = row + r;
        const gridC = col + c;

        if (
          gridR < 0 ||
          gridR >= GRID_SIZE ||
          gridC < 0 ||
          gridC >= GRID_SIZE ||
          grid[gridR][gridC] !== null
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placePiece = (
  grid: CellValue[][],
  piece: PieceData,
  row: number,
  col: number
): CellValue[][] => {
  const newGrid = grid.map((r) => [...r]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] === 1) {
        newGrid[row + r][col + c] = piece.color;
      }
    }
  }
  return newGrid;
};

export const checkLines = (grid: CellValue[][]): { newGrid: CellValue[][]; linesCleared: number } => {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every((cell) => cell !== null)) {
      rowsToClear.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      colsToClear.push(c);
    }
  }

  if (rowsToClear.length === 0 && colsToClear.length === 0) {
    return { newGrid: grid, linesCleared: 0 };
  }

  const newGrid = grid.map((r) => [...r]);

  rowsToClear.forEach((r) => {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[r][c] = null;
    }
  });

  colsToClear.forEach((c) => {
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r][c] = null;
    }
  });

  return { newGrid, linesCleared: rowsToClear.length + colsToClear.length };
};

export const isGameOver = (grid: CellValue[][], availablePieces: PieceData[]): boolean => {
  if (availablePieces.length === 0) return false;

  for (const piece of availablePieces) {
    for (let r = 0; r <= GRID_SIZE - piece.shape.length; r++) {
      for (let c = 0; c <= GRID_SIZE - piece.shape[0].length; c++) {
        if (canPlacePiece(grid, piece, r, c)) {
          return false;
        }
      }
    }
  }
  return true;
};
