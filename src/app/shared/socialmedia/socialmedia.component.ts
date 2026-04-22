import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook, logoWhatsapp, logoTwitter } from 'ionicons/icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.scss'],
  imports: [IonIcon],
  standalone: true,
})
export class SocialmediaComponent {
  @Input() red: number = 0;
  @Input() postId: string = '';
  @Input() postTitle: string = '';
  @Input() contentCount: number = 0;

  private readonly backendUrl = environment.servicio[0].url.replace('/api/v1/', '');

  get hasContent(): boolean {
    return this.contentCount > 0;
  }

  constructor() {
    addIcons({ logoFacebook, logoWhatsapp, logoTwitter });
  }

  private getShareUrl(): string {
    return `${this.backendUrl}/share/${this.postId}`;
  }

  shareOnFacebook() {
    if (!this.hasContent) return;
    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnWhatsApp() {
    if (!this.hasContent) return;
    const url = encodeURIComponent(this.getShareUrl());
    const text = encodeURIComponent(this.postTitle ? `${this.postTitle} ` : '');
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  }

  shareOnTwitter() {
    if (!this.hasContent) return;
    const url = encodeURIComponent(this.getShareUrl());
    const text = encodeURIComponent(this.postTitle || '');
    window.open(`https://x.com/intent/post?url=${url}&text=${text}`, '_blank');
  }

  shareOnTelegram() {
    if (!this.hasContent) return;
    const url = encodeURIComponent(this.getShareUrl());
    const text = encodeURIComponent(this.postTitle || '');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  }
}
