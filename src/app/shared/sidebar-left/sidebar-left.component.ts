import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileFollowService } from 'src/app/services/profile-follow.service';
import { ProfileLikeService } from 'src/app/services/profile-like.service';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import {
  peopleOutline, personAddOutline, heartOutline,
  listOutline, settingsOutline, homeOutline, searchOutline,
  addCircleOutline, analyticsOutline, logOutOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class SidebarLeftComponent implements OnInit, OnDestroy {
  userSession: any = null;
  profilePic: string = 'assets/logo/perfil02.png';
  followersCount = 0;
  followingCount = 0;
  likesCount = 0;
  currentUrl = '';
  private urlfiles = environment.servicio[0].urlfiles;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private profileFollowService: ProfileFollowService,
    private profileLikeService: ProfileLikeService,
    private router: Router,
  ) {
    addIcons({ peopleOutline, personAddOutline, heartOutline, listOutline, settingsOutline, homeOutline, searchOutline, addCircleOutline, analyticsOutline, logOutOutline });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => this.currentUrl = e.urlAfterRedirects);

    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadSession());
  }

  private loadSession() {
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

      const userId = this.userSession?.id;
      if (userId) {
        this.profileLikeService
          .getProfileLikeStatus(profile._id, userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(status => { this.likesCount = status.countlikes; });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(path: string, queryParams?: any) {
    this.router.navigate([path], queryParams ? { queryParams } : {});
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
