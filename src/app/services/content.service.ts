import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  createContent(content: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.url + '/content', content, {
      observe: 'response',
    });
  }

  getAllPosted(page: number, limit: number): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(this.url + 'getpost', { params });
  }
}
