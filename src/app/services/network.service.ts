import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private apiUrl = environment.servicio[0].url;

  constructor(private http: HttpClient) {
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false)),
      of(navigator.onLine)
    )
      .pipe(startWith(navigator.onLine))
      .subscribe((status) => this.onlineSubject.next(status));
  }

  get isOnline$() {
    return this.onlineSubject.asObservable();
  }

  checkApiConnection() {
    return this.http.get(`${this.apiUrl}health`, { observe: 'response' }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
