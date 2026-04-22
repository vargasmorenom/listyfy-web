import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PostedsService } from 'src/app/services/posteds.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage.service';
import { BackComponent } from 'src/app/shared/back/back.component';
import { ShowcontentComponent } from 'src/app/shared/showcontent/showcontent.component';
import { PopupService } from 'src/app/services/popup.service';
import { SocialmediaComponent } from 'src/app/shared/socialmedia/socialmedia.component';
import { LikescountComponent } from 'src/app/shared/likescount/likescount.component';
import { PostFacade } from 'src/app/facade/post.facade';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { addCircle, menuOutline, layersOutline, heartOutline, heart } from 'ionicons/icons';
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
    SidebarLeftComponent, SidebarRightComponent,
  ],
})
export class AdminlistPage implements OnInit, OnDestroy {
  public id!: string;
  public data: any = {};
  public datacont: any;
  public usuario = this.validarEdit();
  public likeCount = 0;
  public liked = false;
  public viewCount = 0;
  public urlfiles = environment.servicio[0].urlfiles;
  private facadeSubs: Subscription[] = [];
  private destroy$ = new Subject<void>();
  private initialized = false;

  constructor(
    public popUp: PopupService,
    public param: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private navegar: Router,
    private posted: PostedsService,
    public messToast: ToastrService,
    private storage: StorageService,
    public facade: PostFacade,
    private meta: Meta,
    private titleService: Title,
  ) {
    addIcons({ addCircle, menuOutline, layersOutline, heartOutline, heart });
  }

  resolveImg(path: string): string {
    if (!path) return environment.servicio[0].defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlfiles + path;
  }

  validarEdit() {
    return this.storage.get('usuario');
  }

  ngOnInit() {
    this.cargarDatos();
    this.suscribirFacade();
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
      this.navegar.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.navegar.navigate(['adminlist'], { queryParams: { id: this.id } });
      });
    }
  }

  private suscribirFacade() {
    this.facadeSubs.push(
      this.facade.post$.subscribe((post) => {
        if (post) {
          this.data = post;
          this.updateOgTags(post);
        }
      }),
      this.facade.likeCount$.subscribe((count) => { this.likeCount = count; }),
      this.facade.liked$.subscribe((liked) => { this.liked = liked; }),
      this.facade.viewCount$.subscribe((count) => { this.viewCount = count; }),
    );
  }

  private updateOgTags(post: any): void {
    const appUrl = environment.servicio[0].appUrl;
    const postUrl = `${appUrl}/adminlist?id=${post._id}`;
    const raw = post.imagen?.[0]?.large ?? post.imagen?.[0]?.medium;
    const imageUrl = raw
      ? (raw.startsWith('http') ? raw : this.urlfiles + raw)
      : `${appUrl}/assets/logo/logoMyllistys.png`;
    const description = post.description?.trim() || post.typePostName || 'mylistys';

    this.titleService.setTitle(`${post.name} | mylistys`);
    [
      { property: 'og:title',       content: post.name },
      { property: 'og:description', content: description },
      { property: 'og:image',       content: imageUrl },
      { property: 'og:url',         content: postUrl },
      { property: 'og:type',        content: 'article' },
    ].forEach(t => this.meta.updateTag(t));
    [
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: post.name },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image',       content: imageUrl },
    ].forEach(t => this.meta.updateTag(t));
  }

  private resetOgTags(): void {
    this.titleService.setTitle('mylistys');
    ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']
      .forEach(p => this.meta.updateTag({ property: p, content: '' }));
  }

  ngOnDestroy() {
    this.resetOgTags();
    this.facadeSubs.forEach((sub) => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos() {
    this.param.queryParams.pipe(takeUntil(this.destroy$)).subscribe((parametro: any) => {
      if (!parametro['id']) { this.navegar.navigate(['/']); return; }
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
    if (this.id && this.usuario?.id) {
      this.facade.trackView(this.id, this.usuario.id);
    }
  }

}
