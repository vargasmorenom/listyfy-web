import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostedsService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  createPosted(posted: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.url + 'newpost', posted, {
      observe: 'response',
    });
  }

  getPostedId(id: string, page: number, limit: number): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('id', id).set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(this.url + 'getpostid', { params });
  }

  getAllPosted(page: number, limit: number): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(this.url + 'getpost', { params });
  }

  getAllPostedByTag(page: number, limit: number, tag: string): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('tagId', tag);
    return this.http.get<any>(this.url + 'postsbytag', { params });
  }

  getOnePosted(id: string): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<any>(this.url + 'getonepost', { params });
  }

  updatePosted(posted: FormData): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.url + 'updatepost', posted, {
      observe: 'response',
    });
  }

  updateForKids(postId: string, forKids: boolean): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('forKids', forKids ? 'true' : 'false');
    return this.http.put<any>(this.url + 'updatepost', formData, {
      observe: 'response',
    });
  }

  deletePosted(posted: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.url + 'deletepost', {
      body: posted,
      observe: 'response', // esto asegura que recibes el objeto HttpResponse completo
    });
  }

  addContent(posted: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.url + 'content/socialid' + posted.typePost, posted, {
      observe: 'response',
    });
  }

  deleteContent(id: any, idpost: any): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('contentId', id.toString()).set('postId', idpost.toString());
    return this.http.delete<any>(this.url + 'deletecontent', { params });
  }

  getTopLiked(limit: number): Observable<any> {
    const params = new HttpParams().set('limit', limit.toString()).set('sort', 'likes');
    return this.http.get<any>(this.url + 'getpost', { params });
  }

  getTopViewed(limit: number): Observable<any> {
    const params = new HttpParams().set('limit', limit.toString()).set('sort', 'views');
    return this.http.get<any>(this.url + 'getpost', { params });
  }
}
