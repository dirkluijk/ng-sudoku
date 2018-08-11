import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import { FormsModule } from '@angular/forms';
import { FormatTimePipe } from './format-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    FormatTimePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
