import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
  IonFooter,
  IonCard,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chevronBackOutline, chevronForwardOutline, checkmarkOutline } from 'ionicons/icons';
import { EmbedUrlService } from 'src/app/services/embed-url.service';
import { PopupService } from 'src/app/services/popup.service';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YOUTUBE_TYPE_POST = 5;

const NETWORK_THEME: Record<number, string> = {
  1: 'theme-twitter',
  2: 'theme-facebook',
  3: 'theme-instagram',
  4: 'theme-tiktok',
  5: 'theme-youtube',
  6: 'theme-linkedin',
  7: 'theme-telegram',
};

export interface CarouselViewerData {
  content: any[];
  typePost: number;
  idpost: string;
}

@Component({
  selector: 'app-carousel-viewer',
  templateUrl: './carousel-viewer.component.html',
  styleUrls: ['./carousel-viewer.component.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonIcon, IonSpinner, IonFooter, IonCard,
  ],
  standalone: true,
})
export class CarouselViewerComponent implements OnInit, OnDestroy {
  /** Abre el carrusel usando el mismo patrón de modal que el resto de la app (PopupService). */
  static open(popUp: PopupService, data: CarouselViewerData): Promise<any> {
    return popUp.showPopupDinamic(
      {
        title: 'Ver todo el contenido',
        message: 'Carrusel',
        confirmText: '',
        id: data,
        cssClass: 'carousel-viewer-modal',
      },
      CarouselViewerComponent
    );
  }

  content: any[] = [];
  typePost = 0;
  idpost = '';

  currentIndex = 0;
  currentItem: any = null;
  loading = true;
  loadError = false;
  isYoutube = false;
  safeUrl: SafeResourceUrl | null = null;

  @ViewChild('ytContainer') ytContainer?: ElementRef<HTMLDivElement>;

  private ytPlayer: any = null;
  private slideToken = 0;
  private static ytApiPromise: Promise<void> | null = null;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private embedUrl: EmbedUrlService
  ) {
    addIcons({ closeOutline, chevronBackOutline, chevronForwardOutline, checkmarkOutline });
  }

  ngOnInit() {
    const data = this.navParams.get('id') ?? {};
    this.content = Array.isArray(data.content) ? data.content : [];
    this.typePost = Number(data.typePost);
    this.idpost = data.idpost ?? '';

    if (!this.content.length) {
      this.close();
      return;
    }
    this.loadSlide(0);
  }

  ngOnDestroy() {
    this.destroyYoutubePlayer();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex >= this.content.length - 1;
  }

  get themeClass(): string {
    return NETWORK_THEME[this.typePost] ?? '';
  }

  goPrevious() {
    if (this.isFirst) return;
    this.loadSlide(this.currentIndex - 1);
  }

  goNext() {
    if (this.isLast) {
      this.close();
      return;
    }
    this.loadSlide(this.currentIndex + 1);
  }

  onIframeLoad() {
    this.loading = false;
  }

  private loadSlide(index: number) {
    this.destroyYoutubePlayer();
    const token = ++this.slideToken;

    this.currentIndex = index;
    this.currentItem = this.content[index];
    this.loading = true;
    this.loadError = false;
    this.isYoutube = this.typePost === YOUTUBE_TYPE_POST;
    this.safeUrl = null;

    if (this.isYoutube) {
      this.setupYoutubeSlide(this.currentItem, token);
    } else {
      const raw = this.embedUrl.buildEmbedUrl(this.typePost, this.currentItem);
      if (raw) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(raw);
      } else {
        this.loading = false;
        this.loadError = true;
      }
    }
  }

  private loadYoutubeApi(): Promise<void> {
    if (window.YT?.Player) return Promise.resolve();
    if (CarouselViewerComponent.ytApiPromise) return CarouselViewerComponent.ytApiPromise;

    CarouselViewerComponent.ytApiPromise = new Promise<void>((resolve, reject) => {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve();
      };
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = () => {
          tag.remove();
          reject(new Error('No se pudo cargar la API de YouTube'));
        };
        document.body.appendChild(tag);
      }
    }).catch((err) => {
      // Permite reintentar en una próxima apertura del carrusel en vez de quedar colgado.
      CarouselViewerComponent.ytApiPromise = null;
      throw err;
    });
    return CarouselViewerComponent.ytApiPromise;
  }

  private async setupYoutubeSlide(item: any, token: number) {
    try {
      await this.loadYoutubeApi();
    } catch {
      if (token === this.slideToken) {
        this.loading = false;
        this.loadError = true;
      }
      return;
    }
    setTimeout(() => {
      if (token !== this.slideToken || !this.ytContainer) return;
      this.ytPlayer = new window.YT.Player(this.ytContainer.nativeElement, {
        videoId: item.id,
        playerVars: { autoplay: 1 },
        events: {
          onReady: () => {
            if (token === this.slideToken) this.loading = false;
          },
        },
      });
    });
  }

  private destroyYoutubePlayer() {
    if (this.ytPlayer) {
      try {
        this.ytPlayer.destroy();
      } catch {
        /* noop */
      }
      this.ytPlayer = null;
    }
  }
}
