import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostedsService } from 'src/app/services/posteds.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage.service';
import { BackComponent } from 'src/app/shared/back/back.component';
import { ScriptLoaderService } from 'src/app/services/scriptloader.service';
import { ShowcontentComponent } from 'src/app/shared/showcontent/showcontent.component';
import { PopupService } from 'src/app/services/popup.service';
import { SocialmediaComponent } from 'src/app/shared/socialmedia/socialmedia.component';
import { LikescountComponent } from 'src/app/shared/likescount/likescount.component';
import { PostFacade } from 'src/app/facade/post.facade';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileFollowService } from 'src/app/services/profile-follow.service';
import { ProfileLikeService } from 'src/app/services/profile-like.service';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  addCircle, menuOutline, layersOutline,
  heartOutline, heart, peopleOutline, personAddOutline,
  personCircleOutline, listOutline, settingsOutline,
} from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { EditcontentlistComponent } from 'src/app/shared/editcontentlist/editcontentlist.component';
import { NewcontentpopupComponent } from 'src/app/shared/newcontentpopup/newcontentpopup.component';
import {
  IonContent, IonImg, IonChip, IonCard, IonCol, IonRow, IonGrid,
  IonCardHeader, IonList, IonItem, IonPopover, IonCardTitle,
  IonButton, IonCardContent, IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.page.html',
  styleUrls: ['./adminlist.page.scss'],
  standalone: true,
  imports: [
    ShowcontentComponent, SocialmediaComponent, IonCardContent, IonPopover,
    IonButton, IonCardTitle, LikescountComponent, IonCardHeader, IonCard,
    IonList, IonItem, IonContent, CommonModule, FormsModule, BackComponent,
    IonIcon, IonGrid, IonRow, IonCol, IonImg, IonChip,
  ],
})
export class AdminlistPage implements OnInit, AfterViewInit, OnDestroy {
  public id!: string;
  public data: any = {};
  public datacont: any;
  public usuario = this.validarEdit();
  public likeCount = 0;
  public liked = false;
  public viewCount = 0;
  public urlfiles = environment.servicio[0].urlfiles;
  private facadeSubs: Subscription[] = [];
  private initialized = false;

  // Sidebar
  userSession: any = null;
  profilePic: string = 'assets/logo/perfil02.png';
  followersCount = 0;
  followingCount = 0;
  likesCount = 0;
  topViewed: any[] = [];
  topLiked: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    public popUp: PopupService,
    public param: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private scriptLoader: ScriptLoaderService,
    private navegar: Router,
    private posted: PostedsService,
    public messToast: ToastrService,
    private storage: StorageService,
    public facade: PostFacade,
    private authService: AuthService,
    private profileFollowService: ProfileFollowService,
    private profileLikeService: ProfileLikeService,
  ) {
    addIcons({
      addCircle, menuOutline, layersOutline,
      heartOutline, heart, peopleOutline, personAddOutline,
      personCircleOutline, listOutline, settingsOutline,
    });
  }

  validarEdit() {
    return this.storage.get('usuario');
  }

  ngOnInit() {
    this.cargarDatos();
    this.suscribirFacade();
    this.loadSidebarData();
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
    this.navegar.navigate([path], queryParams ? { queryParams } : {});
  }

  toggleLike() {
    const userId = this.usuario?.id;
    if (!userId) {
      this.messToast.warning('Debes iniciar sesión para dar like', 'Aviso');
      return;
    }
    this.facade.toggleLike(this.data._id, userId);
  }

  async Addcontent(id: any) {
    if ((this.data.content?.length ?? 0) >= 10) {
      this.messToast.warning('Has alcanzado el límite de 10 artículos por publicación', 'Límite alcanzado');
      return;
    }

    const result = await this.popUp.showPopupDinamic(
      { title: 'Agregar Nuevo Contenido', message: 'Nuevo Contenido', confirmText: '', id: id },
      NewcontentpopupComponent
    );

    if (result?.data) {
      this.facade.loadPost(this.id, this.usuario?.id);
    }
  }

  private suscribirFacade() {
    this.facadeSubs.push(
      this.facade.post$.subscribe((post) => { if (post) this.data = post; }),
      this.facade.likeCount$.subscribe((count) => { this.likeCount = count; }),
      this.facade.liked$.subscribe((liked) => { this.liked = liked; }),
      this.facade.viewCount$.subscribe((count) => { this.viewCount = count; }),
    );
  }

  ngOnDestroy() {
    this.facadeSubs.forEach((sub) => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos() {
    this.param.queryParams.pipe(take(1)).subscribe((parametro: any) => {
      if (!parametro['id']) { this.navegar.navigate(['/']); }
      this.id = parametro['id'];
      this.facade.loadPost(this.id, this.usuario?.id);
      if (this.id && this.usuario?.id) {
        this.facade.trackView(this.id, this.usuario.id);
      }
    });
  }

  async editarContenido(id: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Administración de Contenido', message: 'Editar Contenido', confirmText: '', id: id,
        onComplete: (postId: string) => { this.facade.loadPost(postId, this.usuario?.id); },
      },
      EditcontentlistComponent
    );
    if (result?.cancelled) console.warn('Modal no se abrió porque ya existía uno');
    this.popoverCtrl.dismiss();
  }

  borrarContent(id: any) {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este contenido?');
    if (confirmacion) {
      const datoUser = this.storage.get('usuario');
      this.posted.deletePosted({ postId: id, postedBy: datoUser.id }).subscribe({
        next: (data) => {
          if (data.status === 200) {
            this.messToast.success('Contenido eliminado correctamente', 'Éxito');
            this.popoverCtrl.dismiss();
            this.navegar.navigate(['/']);
          } else {
            this.messToast.error('Error al eliminar el contenido', 'Error');
          }
        },
        error: () => this.messToast.error('Error al eliminar el contenido', 'Error'),
      });
    } else {
      this.messToast.warning('Eliminación cancelada', 'Cancelado');
      this.popoverCtrl.dismiss();
    }
  }

  profileview(id: any) {
    this.navegar.navigate(['perfil'], { queryParams: { id: id } });
  }

  searcherPost(id: any) {
    this.navegar.navigate(['searcher'], { queryParams: { id: id } });
  }

  ionViewWillEnter() {
    if (this.initialized && this.id) {
      this.facade.loadPost(this.id, this.usuario?.id);
    }
    this.initialized = true;
  }

  ionViewDidEnter() {
    this.reprocesarEmbeds();
    if (this.id && this.usuario?.id) {
      this.facade.trackView(this.id, this.usuario.id);
    }
  }

  ngAfterViewInit() {
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
    this.scriptLoader.loadScripts([
      { url: 'https://www.instagram.com/embed.js', globalObject: 'instgrm', callbackMethodPath: 'Embeds.process', innerText: '' },
      { url: 'https://platform.twitter.com/widgets.js', globalObject: 'twttr', callbackMethodPath: 'widgets.load', innerText: '' },
      { url: 'https://www.youtube.com/iframe_api', globalObject: 'YT', callbackMethodPath: '', innerText: '' },
      { url: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0', globalObject: 'FB', callbackMethodPath: 'XFBML.parse', innerText: '' },
      { url: 'https://platform.linkedin.com/in.js', globalObject: 'IN', callbackMethodPath: 'parse', innerText: 'lang: en_US' },
      { url: 'https://telegram.org/js/telegram-widget.js?22', globalObject: 'Telegram', callbackMethodPath: '', innerText: '' },
    ]).catch((err) => console.error('Error cargando scripts:', err));
  }

  private reprocesarEmbeds() {
    if ((window as any).instgrm?.Embeds?.process) (window as any).instgrm.Embeds.process();
    if ((window as any).twttr?.widgets?.load) (window as any).twttr.widgets.load();
    if ((window as any).FB?.XFBML?.parse) (window as any).FB.XFBML.parse();
    if ((window as any).IN?.parse) (window as any).IN.parse();
  }
}
