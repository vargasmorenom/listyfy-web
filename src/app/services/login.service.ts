import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { LoginModel } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url: string;

  constructor(public http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  LoginUser(form: any): Observable<HttpResponse<any>> {
    return this.http.post<LoginModel>(this.url + 'login', form, {
      observe: 'response',
      withCredentials: true
    });
  }

  loginWithGoogle(idToken: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.url + 'auth/google', { idToken }, {
      observe: 'response',
      withCredentials: true,
    });
  }

  recoveryRequest(email: string, recaptchaToken: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.url + 'recovery', { email, recaptchaToken }, {
      observe: 'response',
    });
  }

  recoveryReset(email: string, code: string, password: string): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.url + 'recovery', { email, code, password }, {
      observe: 'response',
    });
  }
}
