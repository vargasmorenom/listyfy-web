import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { InscriptionModel } from './../interfaces/inscription';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private url: string;

  constructor(public http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  increptionUser(form: any): Observable<HttpResponse<any>> {
    return this.http.post<InscriptionModel>(this.url + 'register', form, {
      observe: 'response',
    });
  }
}
