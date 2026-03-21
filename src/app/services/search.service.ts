import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearcherPageService {
  private url: string;
  constructor(public http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  searchForTags(q: string, page: number, limit: number): Observable<any> {
    const params = new HttpParams().set('q', q).set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(this.url + 'search', { params });
  }
}
