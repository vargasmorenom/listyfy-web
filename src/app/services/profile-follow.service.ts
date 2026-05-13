import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
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

export interface FollowEvent {
  action: 'follow' | 'unfollow';
  idprofile: string;
  followerid: string;
  countFollowers: number;
  countFollowing: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileFollowService {
  private url: string;

  // Emite cada vez que un toggle de follow/unfollow tiene éxito
  private followChanged = new Subject<FollowEvent>();
  readonly followChanged$ = this.followChanged.asObservable();

  constructor(private http: HttpClient) {
    this.url = environment.servicio[0].url;
  }

  getFollowStatus(idprofile: string, followerid: string): Observable<FollowStatus> {
    return this.http.get<FollowStatus>(this.url + 'getfollow', {
      params: { idprofile, followerid },
    });
  }

  toggleFollow(idprofile: string, followerid: string): Observable<FollowResult> {
    return this.http.post<FollowResult>(this.url + 'addfollow', { idprofile, followerid }).pipe(
      tap(result => {
        this.followChanged.next({
          action: result.action,
          idprofile,
          followerid,
          countFollowers: result.countFollowers,
          countFollowing: result.countFollowing,
        });
      }),
    );
  }

  getFollowingList(profileid: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'getfollowinglist', {
      params: { profileid },
    });
  }

  getFollowersList(profileid: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'getfollowerslist', {
      params: { profileid },
    });
  }
}
