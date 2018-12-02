import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'key',
})
export class KeyPipe implements PipeTransform {

  transform(value: Object, ...args) {
    return Object.keys(value)[0]
  }
}
