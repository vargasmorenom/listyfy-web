import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook, logoWhatsapp, logoTwitter } from 'ionicons/icons';

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

  get hasContent(): boolean {
    return this.contentCount > 0 && !!this.postId;
  }

  constructor() {
    addIcons({ logoFacebook, logoWhatsapp, logoTwitter });
  }

  private getShareUrl(): string {
    return `${window.location.origin}/shared/${this.postId}`;
  }

  private openShare(buildUrl: (url: string) => string): void {
    if (!this.hasContent) return;
    window.open(buildUrl(encodeURIComponent(this.getShareUrl())), '_blank');
  }

  shareOnFacebook() {
    this.openShare((url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`);
  }

  shareOnWhatsApp() {
    const text = encodeURIComponent(this.postTitle ? `${this.postTitle} ` : '');
    this.openShare((url) => `https://wa.me/?text=${text}${url}`);
  }

  shareOnTwitter() {
    const text = encodeURIComponent(this.postTitle || '');
    this.openShare((url) => `https://x.com/intent/post?url=${url}&text=${text}`);
  }

  shareOnTelegram() {
    const text = encodeURIComponent(this.postTitle || '');
    this.openShare((url) => `https://t.me/share/url?url=${url}&text=${text}`);
  }
}
