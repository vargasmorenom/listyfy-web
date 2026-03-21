import { Component, OnInit, Input } from '@angular/core';
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
export class SocialmediaComponent implements OnInit {
  @Input() red: number = 0;
  @Input() postId: string = '';
  @Input() postTitle: string = '';

  constructor() {
    addIcons({ logoFacebook, logoWhatsapp, logoTwitter });
  }

  ngOnInit() {}

  private getShareUrl(): string {
    return `${window.location.origin}/adminlist?id=${this.postId}`;
  }

  shareOnFacebook() {
    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnWhatsApp() {
    const url = encodeURIComponent(this.getShareUrl());
    const text = encodeURIComponent(this.postTitle ? `${this.postTitle} ` : '');
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  }

  shareOnTwitter() {
    const url = encodeURIComponent(this.getShareUrl());
    const text = encodeURIComponent(this.postTitle || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnTelegram() {
    const url = encodeURIComponent(this.getShareUrl());
    const text = encodeURIComponent(this.postTitle || '');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  }
}
