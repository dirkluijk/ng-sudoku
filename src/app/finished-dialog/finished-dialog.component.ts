import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'su-finished-dialog',
  templateUrl: './finished-dialog.component.html'
})
export class FinishedDialogComponent {
  time: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.time = data.time;
  }
}
