import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackComponent } from 'src/app/shared/back/back.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostedsService } from 'src/app/services/posteds.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileLikeService } from 'src/app/services/profile-like.service';
import { ProfileFollowService } from 'src/app/services/profile-follow.service';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { InfoPerfilComponent } from 'src/app/shared/info-perfil/info-perfil.component';
import { ContentListComponent } from 'src/app/shared/content-list/content-list.component';
import { PopupService } from 'src/app/services/popup.service';
import { EditprofileformComponent } from 'src/app/shared/editprofileform/editprofileform.component';
import {
  IonContent, IonButton, IonSegment, IonSegmentButton,
  IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  person, mail, location, arrowForwardOutline, close, people, heart, images, call,
  peopleOutline, personAddOutline, heartOutline, homeOutline, listOutline, settingsOutline,
} from 'ionicons/icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScrollContent, IonInfiniteScroll, IonButton, IonContent, IonSpinner,
    CommonModule, FormsModule, BackComponent, ContentListComponent,
    InfoPerfilComponent, IonLabel, ReactiveFormsModule, ProfileComponent,
    IonSegment, IonSegmentButton, TranslatePipe,
  ],
})
export class PerfilPage implements OnInit, OnDestroy {
  public name!: string;
  public selectedTab: string = 'info';
  public listasPerfil: any;
  public perfileData: any;
  public session: boolean = false;
  public isOwnProfile: boolean = false;
  public liked: boolean = false;
  public likeCount: number = 0;
  public following: boolean = false;
  public followersCount: number = 0;
  public followingCount: number = 0;
  public perfilSession: any = [];
  public items: any[] = [];
  public idConsult!: string;
  public ini = 1;
  public fin = 3;
  public noMoreItems = false;
  public loadingPerfil = true;
  public urlfiles = environment.servicio[0].urlfiles;
  private destroy$ = new Subject<void>();

  constructor(
    public param: ActivatedRoute,
    public storage: StorageService,
    private perfil: ProfileService,
    private profileLikeService: ProfileLikeService,
    private profileFollowService: ProfileFollowService,
    public popUp: PopupService,
    public router: Router,
    private posted: PostedsService,
    private authService: AuthService
  ) {
    addIcons({ person, mail, location, call, close, arrowForwardOutline, images, people, heart, peopleOutline, personAddOutline, heartOutline, homeOutline, listOutline, settingsOutline });
  }

  ngOnInit() {
    this.session = this.authService.isSessionValid();

    this.param.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const paramId = params['id'];
     console.log('ID del perfil a cargar:', paramId);
      if (paramId) {
        const sessionUser = this.storage.get('usuario');
        this.isOwnProfile = sessionUser?.id === paramId;
        this.dataPerfil(paramId);
        return;
      }

      if (!this.session) {
        this.router.navigate(['/']);
        return;
      }

      this.isOwnProfile = true;
      const user = this.storage.get('usuario');
      if (user?.id) {
        this.dataPerfil(user.id);
      }
    });
  }

  async showWelcome(id: any) {
    const result = await this.popUp.showPopupDinamic(
      { title: 'Editor de Perfil', message: 'Nuevo Contenido', confirmText: '', id: id },
      EditprofileformComponent
    );
    if (result?.data?.updated) {
      this.dataPerfil(this.idConsult);
      console.log('Perfil actualizado:', result.data);
    }
  }

  dataPerfil(id: any) {
    this.idConsult = id;
    this.loadingPerfil = true;
    this.perfil.seachProfile(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.loadingPerfil = false;
        if (data?._id) {
          this.perfilSession = data;
          this.likeCount = data.likeNumber ?? 0;
          if (this.session) {
            this.loadProfileLikeStatus(data._id);
            this.loadFollowStatus(data._id);
          }
        }
      },
      error: () => {
        this.loadingPerfil = false;
      },
    });
    this.loadItems();
  }

  loadProfileLikeStatus(profileId: string) {
    const userId = this.authService.getSession()?.id;
    if (!userId) return;
    this.profileLikeService.getProfileLikeStatus(profileId, userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (status) => {
        this.liked = status.liked;
        this.likeCount = status.countlikes;
      },
    });
  }

  onLikeToggled() {
    const userId = this.authService.getSession()?.id;
    if (!userId || !this.perfilSession?._id) return;

    const wasLiked = this.liked;
    this.liked = !wasLiked;
    this.likeCount += wasLiked ? -1 : 1;

    this.profileLikeService.toggleProfileLike(this.perfilSession._id, userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.liked = res.action === 'like';
        this.likeCount = res.countlikes;
      },
      error: () => {
        this.liked = wasLiked;
        this.likeCount += wasLiked ? 1 : -1;
      },
    });
  }

  loadFollowStatus(profileId: string) {
    const myProfile = this.authService.getProfile();
    if (!myProfile?._id) return;
    this.profileFollowService.getFollowStatus(profileId, myProfile._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (status) => {
        this.following = status.following;
        this.followersCount = status.countFollowers;
        this.followingCount = status.countProfileFollowing;
      },
    });
  }

  onFollowToggled() {
    const myProfile = this.authService.getProfile();
    if (!myProfile?._id || !this.perfilSession?._id) return;

    const wasFollowing = this.following;
    this.following = !wasFollowing;
    this.followersCount += wasFollowing ? -1 : 1;

    this.profileFollowService.toggleFollow(this.perfilSession._id, myProfile._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.following = res.action === 'follow';
        this.followersCount = res.countFollowers;
      },
      error: () => {
        this.following = wasFollowing;
        this.followersCount += wasFollowing ? 1 : -1;
      },
    });
  }

  loadItems(event?: any) {
    this.posted.getPostedId(this.idConsult, this.ini, this.fin).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.items = this.items.concat(data);
        this.ini++;
      } else {
        this.noMoreItems = true;
      }
      if (event?.target) {
        event.target.complete();
      }
    });
  }

  verSeguidores() {
    if (this.perfilSession?._id) {
      this.router.navigate(['seguidores'], { queryParams: { profileId: this.perfilSession._id } });
    }
  }

  verSiguiendo() {
    if (this.perfilSession?._id) {
      this.router.navigate(['siguiendo'], { queryParams: { profileId: this.perfilSession._id } });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMore(event: any) {
    this.loadItems(event);
  }
}
