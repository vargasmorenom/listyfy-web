import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  changePassword(data: { userBy: string; passwordActual: string; password: string }): Observable<any> {
    return this.http.put(this.url + 'changepassword', data);
  }
}
