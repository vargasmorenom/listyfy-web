import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PredictionService } from '../services/prediction.service';

@Injectable({
  providedIn: 'root'
})
export class PredictionFacade {

  private predictionsSubject = new BehaviorSubject<number[][]>([]);
  public predictions$: Observable<number[][]> = this.predictionsSubject.asObservable();

  private topNumbersSubject = new BehaviorSubject<{ num: number, freq: number }[]>([]);
  public topNumbers$: Observable<{ num: number, freq: number }[]> = this.topNumbersSubject.asObservable();

  constructor(private predictionService: PredictionService) { }

  // Generar predicciones y emitir
  generatePredictions(count: number = 5): void {
    const predictions = this.predictionService.generatePredictions(count);
    this.predictionsSubject.next(predictions);
  }

  // Obtener números más frecuentes
  loadTopNumbers(limit: number = 10): void {
    const topNumbers = this.predictionService.getTopNumbers(limit);
    this.topNumbersSubject.next(topNumbers);
  }

  // Generar una sola predicción
  generateSinglePrediction(): number[] {
    return this.predictionService.generatePrediction();
  }
}