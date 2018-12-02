import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'split',
})
export class SplitPipe implements PipeTransform {
 
  transform(value: string, ...args) {
    return value.split("_")[0]+"/"+ value.split("_")[1];
  }
}
