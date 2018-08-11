import { Component, HostListener, OnInit } from '@angular/core';
import { faEraser, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { SudokuSolver } from '@jlguenego/sudoku-generator';
import { Observable, timer } from 'rxjs';

import { Sudoku } from './sudoku/sudoku';

@Component({
  selector: 'su-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  noteMode = false;
  sudoku: Sudoku;
  timer$: Observable<number>;
  eraserIcon = faEraser;
  pencilIcon = faPencilAlt;

  ngOnInit(): void {
    this.generate();
  }

  @HostListener('window:keydown.space') onSpace() {
    this.noteMode = !this.noteMode;
  }

  generate(): void {
    const solution = SudokuSolver.generate();
    const masked = SudokuSolver.carve(solution, 55);

    this.sudoku = solution.map(row => row.map(number => ({ answer: number })));

    masked.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        this.sudoku[rowIndex][colIndex].value = value === 0 ? undefined : value;
        this.sudoku[rowIndex][colIndex].readonly = value !== 0;
      });
    });

    this.timer$ = timer(0, 1000);
  }
}
