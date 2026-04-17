import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { closeOutline, informationCircleOutline, openOutline } from 'ionicons/icons';
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
    private sanitizer: DomSanitizer
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

    const rawUrl = this.buildEmbedUrl();
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    this.externalUrl = this.buildExternalUrl();
  }

  private buildEmbedUrl(): string {
    switch (this.tipo) {
      case 'videos':
        // video/embed es más permisivo que el plugin para videos públicos
        return `https://www.facebook.com/video/embed?video_id=${this.postId}`;
      case 'reel': {
        const href = encodeURIComponent(`https://www.facebook.com/reel/${this.postId}/`);
        return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&height=476&width=267`;
      }
      case 'photo': {
        const href = encodeURIComponent(
          `https://www.facebook.com/photo.php?fbid=${this.postId}&set=${this.postId1}&type=3`
        );
        return `https://www.facebook.com/plugins/post.php?href=${href}&show_text=true&width=500`;
      }
      default: {
        const href = encodeURIComponent(
          `https://www.facebook.com/watch?v=${this.postId}`
        );
        return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=500`;
      }
    }
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
