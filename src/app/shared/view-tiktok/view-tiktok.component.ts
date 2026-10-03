import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonButton,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';
import { EmbedUrlService } from 'src/app/services/embed-url.service';

@Component({
  selector: 'app-view-tiktok',
  templateUrl: './view-tiktok.component.html',
  styleUrls: ['./view-tiktok.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewTiktokComponent implements OnInit {
  public id: any;
  public title: String = 'Ver Contenido TikTok';
  tiktokId!: string;
  externalUrl!: string;
  loading = true;
  safeTikTokUrl!: SafeResourceUrl;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private embedUrl: EmbedUrlService
  ) {}

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.tiktokId = this.id.id;
    this.externalUrl = this.buildExternalUrl(this.id);
    this.safeTikTokUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl.tiktok(this.id));
  }

  // urltik es la URL canónica resuelta en el backend (incluye /video/ o /photo/).
  // Si no existe, se reconstruye a partir del usuario de autorlink.
  private buildExternalUrl(item: any): string {
    if (item.urltik?.includes('tiktok.com/@')) return item.urltik.split('?')[0];
    const usuario = item.autorlink?.split('@')[1];
    const tipo = item.tipo === 'photo' ? 'photo' : 'video';
    return usuario
      ? `https://www.tiktok.com/@${usuario}/${tipo}/${item.id}`
      : `https://m.tiktok.com/v/${item.id}.html`;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }

}
