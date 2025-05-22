import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToYesNo'
})
export class BooleanToYesNoPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Sim' : 'Não';
  }

}
