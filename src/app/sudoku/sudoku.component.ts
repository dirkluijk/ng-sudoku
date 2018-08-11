import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Sudoku, SudokuField } from './sudoku';

const between = (newValue: number, min: number, max: number) => {
  return Math.min(Math.max(newValue, min), max);
};

@Component({
  selector: 'su-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnChanges {
  @Input() sudoku: Sudoku;
  @Input() noteMode: boolean;

  activeField?: SudokuField;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.soduku) {
      this.activeField = undefined;
    }
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

  onFieldClick(field: SudokuField): void {
    this.activeField = this.activeField === field ? undefined : field;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const number = parseInt(event.key, 10);

    // event.preventDefault();

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

  private moveFocus(relativeCol = 0, relativeRow = 0) {
    if (!this.activeField) {
      return;
    }

    const newRow = between(this.currentRow + relativeRow, 0, 8);
    const newCol = between(this.currentCol + relativeCol, 0, 8);

    this.activeField = this.sudoku[newRow][newCol];
  }
}
