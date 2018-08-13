import { SudokuSolver } from '@jlguenego/sudoku-generator';

onmessage = function(e) {
  const solution = SudokuSolver.generate();
  const masked = SudokuSolver.carve(solution, e.data);

  postMessage({
    solution: solution,
    masked: masked
  });
};
