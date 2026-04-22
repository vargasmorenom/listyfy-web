import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SharedLinkService {
  private url = environment.servicio[0].url;

  constructor(private http: HttpClient) {}

  createToken(postId: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.url + 'share', { postId });
  }

  revokeToken(token: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.url + 'share/' + token);
  }

  getSharedContent(token: string): Observable<any> {
    return this.http.get<any>(this.url + 'shared/' + token);
  }
}
