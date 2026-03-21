import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewPostService {
  private url: string;
  constructor(public http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  sddView(id: any,idpost:any): Observable<any> {
    return this.http.put(this.url + 'viewpost', { idPost: idpost, idUser: id});
  }

  getView(idpost: any, iduser?: any): Observable<any> {
    const params: any = { idPost: idpost };
    if (iduser) params['idUser'] = iduser;
    return this.http.get(this.url + 'getviewpost', { params });
  }
}