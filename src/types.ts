export type CellValue = string | null;

export interface PieceData {
  id: string;
  shape: number[][]; // 2D array of 0s and 1s
  color: string;
}

export interface GameState {
  grid: CellValue[][];
  score: number;
  highScore: number;
  availablePieces: PieceData[];
  isGameOver: boolean;
}
