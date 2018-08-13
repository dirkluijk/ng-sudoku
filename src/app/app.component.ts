import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { Sudoku } from './sudoku/sudoku';
import { MatDialog } from '@angular/material';
import { FinishedDialogComponent } from './finished-dialog/finished-dialog.component';

export type Difficulty = 'easy' | 'moderate' | 'hard' | 'expert';

@Component({
  selector: 'su-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sudoku: Sudoku;
  elapsedTime: number;
  difficulty: Difficulty = 'easy';

  private timerSubscription: Subscription;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.generate();
  }

  generate(): void {
    const worker = new Worker('generator.worker.js');

    worker.postMessage(this.numberOfEmptyFields);

    worker.onmessage = (event) => {
      const { solution, masked } = event.data;

      this.sudoku = solution.map(row => row.map(number => ({answer: number})));

      masked.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          this.sudoku[rowIndex][colIndex].value = value === 0 ? undefined : value;
          this.sudoku[rowIndex][colIndex].readonly = value !== 0;
        });
      });

      this.startTimer();

      worker.terminate();
    };
  }

  onGameFinished() {
    this.dialog
      .open(FinishedDialogComponent, {data: {time: this.elapsedTime}})
      .afterClosed()
      .subscribe(() => this.generate());
  }

  private get numberOfEmptyFields(): number {
    switch (this.difficulty) {
      case 'easy':
        return 35;
      case 'moderate':
        return 45;
      case 'hard':
        return 52;
      case 'expert':
        return 58;
    }
  }

  private startTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = timer(0, 1000).subscribe(time => this.elapsedTime = time);
  }
}
