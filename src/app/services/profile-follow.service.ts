import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FollowStatus {
  following: boolean;
  countFollowers: number;
  countFollowing: number;
  countProfileFollowing: number;
}

export interface FollowResult {
  action: 'follow' | 'unfollow';
  countFollowers: number;
  countFollowing: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileFollowService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  getFollowStatus(idprofile: string, followerid: string): Observable<FollowStatus> {
    return this.http.get<FollowStatus>(this.url + 'getfollow', {
      params: { idprofile, followerid },
    });
  }

  toggleFollow(idprofile: string, followerid: string): Observable<FollowResult> {
    return this.http.post<FollowResult>(this.url + 'addfollow', { idprofile, followerid });
  }
}
