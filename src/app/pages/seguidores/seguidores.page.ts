import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { personRemoveOutline } from 'ionicons/icons';
import { AlertController, NavController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { BackComponent } from 'src/app/shared/back/back.component';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { ProfileFollowService } from 'src/app/services/profile-follow.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.page.html',
  styleUrls: ['./seguidores.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, BackComponent, SidebarLeftComponent, SidebarRightComponent],
})
export class SeguidoresPage implements OnInit, OnDestroy {
  items: any[] = [];
  loading = true;
  isOwnProfile = false;
  private profileId!: string;
  private destroy$ = new Subject<void>();
  readonly urlfiles = environment.servicio[0].urlfiles;
  readonly defaultAvatar = environment.servicio[0].defaultAvatar;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private followService: ProfileFollowService,
    private authService: AuthService,
    private alertController: AlertController,
  ) {
    addIcons({ personRemoveOutline });
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.profileId = params['profileId'];
      if (!this.profileId) { this.router.navigate(['/']); return; }
      this.isOwnProfile = this.authService.getProfile()?._id === this.profileId;
      this.loadList();
    });
  }

  private loadList() {
    this.loading = true;
    this.followService
      .getFollowersList(this.profileId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          
          this.items = data ?? [];
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
  }

  async confirmRemove(item: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar seguidor',
      message: `¿Deseas eliminar a "${item.chanelName}" de tus seguidores?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'alert-button-danger',
          handler: () => this.removeFollower(item),
        },
      ],
    });
    await alert.present();
  }

  private removeFollower(item: any) {
    const followerProfileId = item._id;
    this.items = this.items.filter((i) => i._id !== followerProfileId);

    this.followService
      .toggleFollow(this.profileId, followerProfileId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => { this.items = [...this.items, item]; },
      });
  }

  verPerfil(item: any) {
 
    if (!item) return;
    this.navCtrl.navigateForward('perfil', { queryParams: { id: item } });
  }

  resolveImg(path: string): string {
    if (!path) return this.defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlfiles + path;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
