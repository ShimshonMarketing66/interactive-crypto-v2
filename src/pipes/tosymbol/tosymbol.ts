import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TosymbolPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'tosymbol',
})
export class TosymbolPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return value.split("_")[1];
  }
}
