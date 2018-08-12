import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sudoku, SudokuField } from '../sudoku';

@Component({
  selector: 'su-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  @Input() sudoku: Sudoku;
  @Input() activeField?: SudokuField;

  @Output() activeFieldChange = new EventEmitter<SudokuField>();

  onFieldClick(field: SudokuField): void {
    this.activeField = this.activeField === field ? undefined : field;
    this.activeFieldChange.emit(this.activeField);
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
}
