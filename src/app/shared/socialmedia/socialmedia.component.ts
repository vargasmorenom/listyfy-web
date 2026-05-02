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
  @Input() shareUrl: string = '';
  @Input() postTitle: string = '';
  @Input() contentCount: number = 0;

  get hasContent(): boolean {
    return this.contentCount > 0 && !!this.shareUrl;
  }

  constructor() {
    addIcons({ logoFacebook, logoWhatsapp, logoTwitter });
  }

  private openShare(buildUrl: (url: string) => string): void {
    if (!this.hasContent) return;
    window.open(buildUrl(encodeURIComponent(this.shareUrl)), '_blank');
  }

  shareOnFacebook() {
    if (!this.hasContent) return;
    const url = encodeURIComponent(this.shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnWhatsApp() {
    this.openShare((url) => `https://wa.me/?text=${url}`);
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
