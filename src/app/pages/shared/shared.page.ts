import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SharedLinkService } from 'src/app/services/shared-link.service';
import { ShowcontentComponent } from 'src/app/shared/showcontent/showcontent.component';
import { environment } from 'src/environments/environment';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonImg, IonChip, IonSpinner, IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.page.html',
  styleUrls: ['./shared.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonImg, IonChip, IonSpinner, IonButton, ShowcontentComponent,
  ],
})
export class SharedPage implements OnInit, OnDestroy {
  data: any = null;
  loading = true;
  error = false;
  urlfiles = environment.servicio[0].urlfiles;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private sharedLinkService: SharedLinkService,
    private meta: Meta,
    private titleService: Title,
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) { this.error = true; this.loading = false; return; }

    this.sharedLinkService.getSharedContent(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          this.data = post;
          this.loading = false;
          this.setOgTags(post);
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.titleService.setTitle('mylistys');
  }

  resolveImg(path: string): string {
    if (!path) return environment.servicio[0].defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlfiles + path;
  }

  private setOgTags(post: any): void {
    const appUrl   = environment.servicio[0].appUrl;
    const urlfiles = environment.servicio[0].urlfiles;

    // Obtener imagen - priorizar large, luego medium
    let imageUrl: string;
    if (post.imagen?.[0]) {
      const imagePath = post.imagen[0].large || post.imagen[0].medium;
      if (imagePath) {
        imageUrl = imagePath.startsWith('http') ? imagePath : `${urlfiles}${imagePath}`;
      } else {
        imageUrl = `${appUrl}/assets/logo/logoMyllistys.png`;
      }
    } else {
      imageUrl = `${appUrl}/assets/logo/logoMyllistys.png`;
    }

    const description = post.description?.trim() || post.typePostName || 'mylistys';
    const pageUrl = window.location.href;

    this.titleService.setTitle(`${post.name} | mylistys`);

    // Meta tags Open Graph + Twitter (igual que Twitter los lee)
    const ogTags = [
      { property: 'og:title', content: post.name },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:secure_url', content: imageUrl },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: pageUrl },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: 'mylistys' },
    ];

    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@mylistys' },
      { name: 'twitter:title', content: post.name },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
    ];

    ogTags.forEach(t => this.meta.updateTag(t));
    twitterTags.forEach(t => this.meta.updateTag(t));

    console.log('[OG] URL Imagen:', imageUrl);
    console.log('[OG] Página:', pageUrl);
  }
}
