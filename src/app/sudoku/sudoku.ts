export type Sudoku = SudokuField[][];

export interface SudokuField {
  value?: number;
  notes?: number[];
  answer: number;
  readonly?: boolean;
}
