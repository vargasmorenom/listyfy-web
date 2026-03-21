import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from '../interfaces/profile';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private url: string;
  constructor(public http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  seachProfile(id: any): Observable<any> {
    return this.http.get<any>(this.url + 'getprofile?id=' + id);
  }

  addProfile(body: any): Observable<any> {
    return this.http.post<ProfileModel>(this.url + 'profile', body);
  }

  updateProfile(body: any): Observable<any> {
    return this.http.put<ProfileModel>(this.url + 'updateprofile', body);
  }

  updateImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'profileimage', formData);
  }
}
