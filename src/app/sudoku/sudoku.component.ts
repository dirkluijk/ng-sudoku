import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Sudoku, SudokuField } from './sudoku';

const between = (newValue: number, min: number, max: number) => {
  return Math.min(Math.max(newValue, min), max);
};

interface NumberButton {
  number: number;
  disabled?: boolean;
}

@Component({
  selector: 'su-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnChanges {
  @Input() sudoku: Sudoku;
  @Output() finish = new EventEmitter<void>();

  noteMode = false;
  activeField?: SudokuField;

  numberButtons: NumberButton[] = [
    {number: 1},
    {number: 2},
    {number: 3},
    {number: 4},
    {number: 5},
    {number: 6},
    {number: 7},
    {number: 8},
    {number: 9}
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.soduku) {
      this.activeField = undefined;
      this.checkNumbers();
    }
  }

  @HostListener('window:keydown.space') onSpace() {
    this.noteMode = !this.noteMode;
  }

  @HostListener('window:keydown.arrowUp') onArrowUp(): void {
    this.moveFocus(0, -1);
  }

  @HostListener('window:keydown.arrowDown') onArrowDown(): void {
    this.moveFocus(0, 1);
  }

  @HostListener('window:keydown.arrowLeft') onArrowLeft(): void {
    this.moveFocus(-1, 0);
  }

  @HostListener('window:keydown.arrowRight') onArrowRight(): void {
    this.moveFocus(1, 0);
  }

  @HostListener('window:keydown.backspace') onBackspace(): void {
    this.erase();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const number = parseInt(event.key, 10);

    if (!this.activeField || isNaN(number) || number < 1 || number > 9) {
      return;
    }

    this.insertNumber(number);
  }

  erase() {
    if (this.activeField && !this.activeField.readonly) {
      this.activeField.notes = [];
      this.activeField.value = undefined;
    }
  }

  hint() {
    if (this.activeField && !this.activeField.readonly) {
      this.activeField.value = this.activeField.answer;
      this.checkFinished();
    }
  }

  insertNumber(number: number) {
    const field = this.activeField;

    if (this.noteMode && !field.value) {
      if (!field.notes) {
        this.activeField.notes = [];
      }
      if (!field.notes.find(i => i === number)) {
        field.notes = field.notes.concat(number);
      } else {
        field.notes = field.notes.filter(i => i !== number);
      }
    } else if (!this.noteMode && !field.readonly) {
      field.value = number;

      this.cleanNotes();
      this.checkNumbers();
      this.checkFinished();
    }
  }

  get currentRow(): number {
    return this.sudoku.findIndex(row => row.indexOf(this.activeField) !== -1);
  }

  get currentCol(): number {
    if (!this.activeField || this.currentRow === -1) {
      return -1;
    }

    return this.sudoku[this.currentRow].indexOf(this.activeField);
  }

  private moveFocus(relativeCol = 0, relativeRow = 0): void {
    if (!this.activeField) {
      return;
    }

    const newRow = between(this.currentRow + relativeRow, 0, 8);
    const newCol = between(this.currentCol + relativeCol, 0, 8);

    this.activeField = this.sudoku[newRow][newCol];
  }

  private cleanNotes(): void {
    const removeNote = (field: SudokuField) => {
      field.notes = field.notes ? field.notes.filter(n => n !== this.activeField.value) : [];
    };

    this.sudoku[this.currentRow].forEach(field => removeNote(field));
    this.sudoku.forEach(row => removeNote(row[this.currentCol]));

    // also within square...
    const firstCol = this.currentCol - this.currentCol % 3;
    const firstRow = this.currentRow - this.currentRow % 3;

    [0, 1, 2].forEach(rowOffset => {
      [0, 1, 2].forEach(colOffset => {
        removeNote(this.sudoku[firstRow + rowOffset][firstCol + colOffset]);
      });
    });
  }

  private checkNumbers(): void {
    const countNumber = i => this.sudoku.reduce((sum, row) => sum + row.filter(f => f.value === i).length, 0);

    this.numberButtons.forEach(button => {
      button.disabled = countNumber(button.number) >= 9;
    });
  }

  private checkFinished(): void {
    if (this.finished) {
      this.finish.emit();
    }
  }

  private get finished(): boolean {
    return this.sudoku.every(row => row.every(field => field.value === field.answer));
  }
}
