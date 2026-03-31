import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  constructor() { }

  generatePrediction(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  generatePredictions(count: number = 5): number[][] {
    return Array.from({ length: count }, () => this.generatePrediction());
  }

  getTopNumbers(limit: number = 10): { num: number, freq: number }[] {
    return Array.from({ length: limit }, (_, i) => ({
      num: i + 1,
      freq: Math.floor(Math.random() * 100)
    })).sort((a, b) => b.freq - a.freq);
  }
}
