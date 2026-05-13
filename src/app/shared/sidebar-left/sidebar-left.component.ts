import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileFollowService } from 'src/app/services/profile-follow.service';
import { ProfileLikeService } from 'src/app/services/profile-like.service';
import { SocketLikeService } from 'src/app/services/socket-like.service';
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
  profilePic: string = '';
  followersCount = 0;
  followingCount = 0;
  likesCount = 0;
  myProfileId = '';
  currentUrl = '';
  private urlfiles = environment.servicio[0].urlfiles;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private profileFollowService: ProfileFollowService,
    private profileLikeService: ProfileLikeService,
    private socketService: SocketLikeService,
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

    // Actualización inmediata al seguir/dejar de seguir desde cualquier parte de la app
    this.profileFollowService.followChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (!this.myProfileId) return;
        // Yo seguí o dejé de seguir a alguien → actualizar "Siguiendo"
        if (event.followerid === this.myProfileId) {
          this.followingCount = event.countFollowing;
        }
        // Alguien me siguió o dejó de seguirme → actualizar "Seguidores"
        if (event.idprofile === this.myProfileId) {
          this.followersCount = event.countFollowers;
        }
      });

    // Actualización en tiempo real desde otros usuarios vía socket
    this.socketService.on<any>('follow:updated')
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (!this.myProfileId) return;
        if (data.idprofile === this.myProfileId) {
          this.followersCount = data.countFollowers;
        }
        if (data.followerid === this.myProfileId) {
          this.followingCount += data.action === 'follow' ? 1 : -1;
        }
      });
  }

  private loadSession() {
    this.userSession = this.authService.getSession();
    const profile = this.authService.getProfile();
    this.profilePic = 'assets/logo/perfil02.png';
    this.myProfileId = profile?._id ?? '';

    if (profile?.profilePic?.medium) {
      const pic = profile.profilePic.medium;
      this.profilePic = pic?.startsWith('http') ? pic : this.urlfiles + pic;
    }

    if (profile?._id) {
      this.profileFollowService
        .getFollowStatus(profile._id, profile._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: status => {
            this.followersCount = status.countFollowers;
            this.followingCount = status.countProfileFollowing;
          },
          error: () => {},
        });

      const userId = this.userSession?.id;
      if (userId) {
        this.profileLikeService
          .getProfileLikeStatus(profile._id, userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: status => { this.likesCount = status.countlikes; },
            error: () => {},
          });
      }
    }
  }

  verSeguidores() {
    if (this.myProfileId) {
      this.router.navigate(['/seguidores'], { queryParams: { profileId: this.myProfileId } });
    }
  }

  verSiguiendo() {
    if (this.myProfileId) {
      this.router.navigate(['/siguiendo'], { queryParams: { profileId: this.myProfileId } });
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
