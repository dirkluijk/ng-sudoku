import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const seconds = value % 60;
    const minutes = Math.floor(value / 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
