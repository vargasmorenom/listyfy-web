import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ContentListComponent } from 'src/app/shared/content-list/content-list.component';

import { PostedsService } from '../services/posteds.service';
import { MenuStateService } from '../services/menu-state.service';
import { AuthService } from '../services/auth.service';
import { ProfileFollowService } from '../services/profile-follow.service';
import { ProfileLikeService } from '../services/profile-like.service';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { addIcons } from 'ionicons';
import { heart, heartOutline, peopleOutline, personAddOutline, personCircleOutline, listOutline, settingsOutline } from 'ionicons/icons';

import { IonInfiniteScroll, IonInfiniteScrollContent, IonContent, IonIcon } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ContentListComponent,
    IonContent,
    IonIcon,
    CommonModule,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonContent) ionContent!: IonContent;
  items: any[] = [];
  ini = 1;
  fin = 3;
  allLoaded = false;
  private routerSub?: Subscription;
  private destroy$ = new Subject<void>();

  userSession: any = null;
  profilePic: string = 'assets/logo/perfil02.png';
  followersCount: number = 0;
  followingCount: number = 0;
  likesCount: number = 0;
  topViewed: any[] = [];
  topLiked: any[] = [];
  urlfiles = environment.servicio[0].urlfiles;

  constructor(
    private posted: PostedsService,
    private menuState: MenuStateService,
    private router: Router,
    private authService: AuthService,
    private profileFollowService: ProfileFollowService,
    private profileLikeService: ProfileLikeService,
  ) {
    addIcons({ heartOutline, heart, peopleOutline, personAddOutline, personCircleOutline, listOutline, settingsOutline });
  }

  ngOnInit() {
    this.loadItems();
    this.loadSidebarData();
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter((e: any) => e.urlAfterRedirects === '/' || e.urlAfterRedirects === '/home')
    ).subscribe(() => this.scrollToLastViewed());
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSidebarData() {
    this.userSession = this.authService.getSession();
    const profile = this.authService.getProfile();

    if (profile?.profilePic) {
      this.profilePic = this.urlfiles + profile.profilePic[0].small;
    }

    if (profile?._id) {
      this.profileFollowService
        .getFollowStatus(profile._id, profile._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(status => {
          this.followersCount = status.countFollowers;
          this.followingCount = status.countProfileFollowing;
        });

      const userId = this.authService.getSession()?.id;
      if (userId) {
        this.profileLikeService
          .getProfileLikeStatus(profile._id, userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(status => {
            this.likesCount = status.countlikes;
          });
      }
    }

    this.posted.getTopViewed(5).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data?.length) this.topViewed = data;
    });

    this.posted.getTopLiked(5).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data?.length) this.topLiked = data;
    });
  }

  navigate(path: string, queryParams?: any) {
    this.router.navigate([path], queryParams ? { queryParams } : {});
  }

  private async scrollToLastViewed() {
    const saved = localStorage.getItem('lastScrollPosition');
    if (!saved) return;
    const scrollTop = parseInt(saved, 10);
    setTimeout(() => {
      this.ionContent.scrollToPoint(0, scrollTop, 0);
      localStorage.removeItem('lastScrollPosition');
    }, 50);
  }

  loadItems(event?: any) {
    this.posted.getAllPosted(this.ini, this.fin).subscribe((data: any) => {
      if (!data || data.length === 0) {
        this.allLoaded = true;
      } else {
        this.items = this.items.concat(data);
        this.ini++;
      }
      event?.target.complete();
    });
  }

  loadMore(event: any) {
    this.loadItems(event);
  }

  lastScrollTop = 0;
  scrollTimeout: any;

  onScroll(event: CustomEvent) {
    const scrollTop = event.detail.scrollTop;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    if (scrollTop > this.lastScrollTop + 1) {
      this.menuState.setMenuHidden(true);
    } else if (scrollTop < this.lastScrollTop - 1) {
      this.menuState.setMenuHidden(false);
    }

    this.scrollTimeout = setTimeout(() => {
      this.menuState.setMenuHidden(false);
    }, 300);

    this.lastScrollTop = scrollTop;
    localStorage.setItem('lastScrollPosition', String(scrollTop));
  }
}
