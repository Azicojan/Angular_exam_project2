import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'populationFormat'
})
export class PopulationFormatPipe implements PipeTransform {
  transform(population: number): string {
    if (population >= 1000000) {
      const millionValue = population / 1000000;
      return millionValue.toFixed(1) + 'M';
    } else if (population >= 1000) {
      const thousandValue = population / 1000;
      return thousandValue.toFixed(1) + 'K';
    } else {
      return population.toString();
    }
  }
}
