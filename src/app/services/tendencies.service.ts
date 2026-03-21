import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from '../interfaces/profile';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TendenciesService {
  private url: string;
  constructor(public http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  seachTendencies(): Observable<any> {
    return this.http.get<any>(this.url + 'trendingtags');
  }

  viewTendency(id: any): Observable<ProfileModel> {
    return this.http.get<ProfileModel>(this.url + 'postsbytag/?tags=' + id);
  }
}
