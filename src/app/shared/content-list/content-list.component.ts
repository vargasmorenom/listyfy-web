import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart, heartOutline, layersOutline, personAdd, personAddOutline, personRemove, personRemoveOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { ProfileFollowService } from 'src/app/services/profile-follow.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ContentListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() entityNames: Array<any> = [];
  urlfiles = environment.servicio[0].urlfiles;
  defaultAvatar = environment.servicio[0].defaultAvatar;

  followStatus: Map<string, boolean> = new Map();
  followLoading: Map<string, boolean> = new Map();
  imgLoadedSet: Set<string> = new Set();
  isLoggedIn = false;
  myProfileId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private profileFollowService: ProfileFollowService,
    private authService: AuthService,
  ) {
    addIcons({ heartOutline, heart, layersOutline, personAdd, personAddOutline, personRemove, personRemoveOutline });
    this.isLoggedIn = this.authService.isSessionValid();
    if (this.isLoggedIn) {
      this.myProfileId = this.authService.getProfile()?._id ?? null;
    }
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entityNames']) {
      this.loadFollowStatuses();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFollowStatuses() {
    if (!this.isLoggedIn || !this.myProfileId) return;
    const seen = new Set<string>();
    for (const item of this.entityNames) {
      const profileId = item.profileId?._id;
      if (!profileId || seen.has(profileId) || profileId === this.myProfileId) continue;
      seen.add(profileId);
      this.profileFollowService
        .getFollowStatus(profileId, this.myProfileId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({ next: (status) => this.followStatus.set(profileId, status.following) });
    }
  }

  isOwnContent(item: any): boolean {
    return !!this.myProfileId && this.myProfileId === item.profileId?._id;
  }

  toggleFollow(event: Event, item: any) {
    event.stopPropagation();
    if (!this.myProfileId) return;
    const profileId = item.profileId?._id;
    if (!profileId || this.followLoading.get(profileId)) return;

    const wasFollowing = this.followStatus.get(profileId) ?? false;
    this.followStatus.set(profileId, !wasFollowing);
    this.followLoading.set(profileId, true);

    this.profileFollowService
      .toggleFollow(profileId, this.myProfileId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.followStatus.set(profileId, res.action === 'follow');
          this.followLoading.set(profileId, false);
        },
        error: () => {
          this.followStatus.set(profileId, wasFollowing);
          this.followLoading.set(profileId, false);
        },
      });
  }

  resolveImg(path: string): string {
    if (!path) return environment.servicio[0].defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlfiles + path;
  }

  getTipoImg(typePostName: string): string {
    const map: Record<string, string> = {
      'Twitter-or-X': 'assets/fondos/x-twitter.jpg',
      'Facebook': 'assets/fondos/facebook.jpg',
      'Instagram': 'assets/fondos/instagram.jpg',
      'TikTok': 'assets/fondos/tiktok.jpg',
      'Youtube': 'assets/fondos/youtube.jpg',
      'LinkedIn': 'assets/fondos/lin.jpg',
    };
    return map[typePostName] ?? 'assets/fondos/fondo1.jpg';
  }

  markImgLoaded(key: string): void {
    this.imgLoadedSet.add(key);
  }

  isImgLoaded(key: string): boolean {
    return this.imgLoadedSet.has(key);
  }

  seeContent(id: string) {
    this.router.navigate(['adminlist'], {
      queryParams: { id: id },
    });
  }

  perfil(user: string) {
    this.navCtrl.navigateForward('perfil', {
      queryParams: { id: user },
    });
  }
}
