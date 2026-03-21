import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileLikeService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  getProfileLikeStatus(
    idprofile: string,
    idprofileLike: string
  ): Observable<{ countlikes: number; liked: boolean }> {
    return this.http.get<any>(this.url + 'profilelikes', {
      params: { idprofile, idprofileLike },
    });
  }

  toggleProfileLike(
    idprofile: string,
    idprofileLike: string
  ): Observable<{ countlikes: number; action: string }> {
    return this.http.post<any>(this.url + 'profilelikes', { idprofile, idprofileLike });
  }
}
