import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountrysService {
  private cache$!: Observable<any[]>;
  constructor(private http: HttpClient) {}

  getCountries(): Observable<any[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<any[]>('../../assets/files/codPhoneWord.json').pipe(shareReplay(1));
    }
    return this.cache$;
  }
}
