import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonGrid, IonButton, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { ActivatedRoute } from '@angular/router';
import { EditprofileimageformComponent } from '../editprofileimageform/editprofileimageform.component';
import {
  person,
  mail,
  location,
  arrowForwardOutline,
  close,
  people,
  peopleCircle,
  heart,
  heartOutline,
  images,
  imageOutline,
} from 'ionicons/icons';
import { PopupService } from 'src/app/services/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonGrid, IonButton, IonRow, IonCol, IonIcon, TranslatePipe],
})
export class ProfileComponent implements OnInit {
  @Input() info!: any;
  @Input() session!: boolean;
  @Input() isOwnProfile: boolean = false;
  @Input() liked: boolean = false;
  @Input() likeCount: number = 0;
  @Input() following: boolean = false;
  @Input() followersCount: number = 0;
  @Input() followingCount: number = 0;
  @Output() likeToggled = new EventEmitter<void>();
  @Output() followToggled = new EventEmitter<void>();
  public page!: string;
  public dcimg: string = '';
  public urlBack = environment.servicio[0].urlfiles;

  constructor(
    private activatedRoute: ActivatedRoute,
    public popUp: PopupService,
    private authService: AuthService
  ) {
    addIcons({ imageOutline, people, peopleCircle, heart, heartOutline, images, person, mail, location, close, arrowForwardOutline });
  }

  ngOnInit() {

    if (this.session) {
      const profile = this.authService.getProfile();
      this.imagenPerfil(profile);
    } else {
      this.dcimg = environment.servicio[0].defaultAvatar;
      const currentRouteSnapshot = this.activatedRoute.snapshot;
      this.page = currentRouteSnapshot.url.join('/');
    }
  }

  mostrarData(id: any) {
    this.popUp.showPopupDinamic(
      {
        title: 'Administracion de Contenido',
        message: 'Nuevo Contenido',
        confirmText: '',
        id: id,
      },
      EditprofileimageformComponent
    );
  }

  resolveImg(path: string): string {
    if (!path) return environment.servicio[0].defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlBack + path;
  }

  imagenPerfil(data: any) {
    if (data?.profilePic?.[0]?.medium) {
      this.dcimg = this.resolveImg(data.profilePic[0].medium);
    } else {
      this.dcimg = environment.servicio[0].defaultAvatar;
    }
  }
}
