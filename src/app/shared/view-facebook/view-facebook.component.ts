import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { closeOutline, informationCircleOutline, openOutline } from 'ionicons/icons';
import { EmbedUrlService } from 'src/app/services/embed-url.service';
import {
  IonButton,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-view-facebook',
  templateUrl: './view-facebook.component.html',
  styleUrls: ['./view-facebook.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewFacebookComponent implements OnInit {
  public id: any;
  tipo!: string;
  postId!: string;
  postId1?: string;
  loading = true;
  safeUrl!: SafeResourceUrl;
  externalUrl!: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private embedUrl: EmbedUrlService
  ) {
    addIcons({ closeOutline, informationCircleOutline, openOutline });
  }

  ngOnInit() {
    this.id = this.navParams.get('id');
    if (!this.id) {
      console.error('ViewFacebook: no se recibieron datos del item');
      return;
    }
    this.tipo = this.id.listas?.tipo ?? this.id.tipo ?? 'posts';
    this.postId = this.id.listas?.id ?? this.id.id;
    this.postId1 = this.id.listas?.id1 ?? this.id.id1;

    const rawUrl = this.embedUrl.facebook(this.id);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    this.externalUrl = this.buildExternalUrl();
  }

  private buildExternalUrl(): string {
    switch (this.tipo) {
      case 'videos':
        return `https://www.facebook.com/watch/?v=${this.postId}`;
      case 'reel':
        return `https://www.facebook.com/reel/${this.postId}/`;
      case 'photo':
        return `https://www.facebook.com/photo.php?fbid=${this.postId}`;
      default:
        return `https://www.facebook.com/permalink.php?story_fbid=${this.postId}`;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }
}
