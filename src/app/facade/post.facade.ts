import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { PostedsService } from '../services/posteds.service';
import { LikeService } from '../services/like.service';
import { ViewPostService } from '../services/viewPost.service';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostFacade {
  
  private postSubject = new BehaviorSubject<Post | null>(null);
  post$ = this.postSubject.asObservable();

  private likeCountSubject = new BehaviorSubject<number>(0);
  likeCount$ = this.likeCountSubject.asObservable();

  private likedSubject = new BehaviorSubject<boolean>(false);
  liked$ = this.likedSubject.asObservable();

  private viewCountSubject = new BehaviorSubject<number>(0);
  viewCount$ = this.viewCountSubject.asObservable();

  private viewTracked = false;
  private currentUserId?: string;

  constructor(
    private postService: PostedsService,
    private likeService: LikeService,
    private viewService: ViewPostService
  ) {
    this.listenSocketLikes();
  }
  // =====================
  // LOAD POST
  // =====================
  loadPost(postId: string, userId?: string) {
    this.currentUserId = userId;
    this.viewTracked = false;
    this.postSubject.next(null);
    this.likeCountSubject.next(0);
    this.likedSubject.next(false);
    this.viewCountSubject.next(0);
    this.postService.getOnePosted(postId).pipe(take(1)).subscribe((post: any) => {
      this.postSubject.next(post);
      this.initLikes(post, userId);
      this.loadViews(postId, userId);
    });
  }

  // =====================
  // LIKES
  // =====================
  private initLikes(post: any, userId?: string) {
    this.likeCountSubject.next(post.likeNumber ?? 0);

    if (!userId) return;

    this.likeService.getLikeStatus(post._id, userId).pipe(take(1)).subscribe({
      next: (res) => {
        this.likeCountSubject.next(res.likeNumber);
        this.likedSubject.next(res.liked);
      },
      error: () => { /* conservar valores actuales */ }
    });
  }

  toggleLike(postId: string, userId: string) {
    const liked = this.likedSubject.value;
    const prevCount = this.likeCountSubject.value || 0;

    // optimistic
    this.likedSubject.next(!liked);
    this.likeCountSubject.next(prevCount + (!liked ? 1 : -1));

    this.likeService.toggleLikeHttp(postId, userId).pipe(take(1)).subscribe({
      next: (res: any) => {
        if (res?.likeNumber !== undefined) {
          this.likeCountSubject.next(res.likeNumber);
        }
        if (res?.action !== undefined) {
          this.likedSubject.next(res.action === 'like');
        }
      },
      error: () => {
        this.likedSubject.next(liked);
        this.likeCountSubject.next(prevCount);
      }
    });
  }

  private listenSocketLikes() {
    this.likeService.onLikeUpdated().subscribe(update => {
      const post = this.postSubject.value;
      if (post && update.postId === post._id) {
        this.likeCountSubject.next(update.newLikeCount);
        if (update.userId === this.currentUserId) {
          this.likedSubject.next(update.action === 'like');
        }
      }
    });
  }

  // =====================
  // VIEWS
  // =====================
  private loadViews(postId: string, userId?: string) {
    this.viewService.getView(postId, userId).pipe(take(1)).subscribe({
      next: (res: any) => {
        this.viewCountSubject.next(res?.viewCount ?? 0);
      },
      error: () => { /* conservar valores actuales */ }
    });
  }

  trackView(postId: string, userId: string) {
    if (this.viewTracked) return;
    this.viewTracked = true;

    timer(10000).subscribe(() => {
      this.viewService.sddView(userId, postId).pipe(take(1)).subscribe(res => {
        this.viewCountSubject.next(res?.viewCount ?? this.viewCountSubject.value + 1);
      });
    });
  }
}