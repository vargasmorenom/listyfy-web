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
  showTutorial = true;
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
    const raw      = post.imagen?.large ?? post.imagen?.medium;
    const imageUrl = raw
      ? (raw.startsWith('http') ? raw : this.urlfiles + raw)
      : `${appUrl}/assets/logo/logoMyllistys.png`;
    const description = post.description?.trim() || post.typePostName || 'mylistys';

    this.titleService.setTitle(`${post.name} | mylistys`);
    [
      { property: 'og:title',       content: post.name },
      { property: 'og:description', content: description },
      { property: 'og:image',       content: imageUrl },
      { property: 'og:url',         content: window.location.href },
      { property: 'og:type',        content: 'article' },
    ].forEach(t => this.meta.updateTag(t));
    [
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: post.name },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image',       content: imageUrl },
    ].forEach(t => this.meta.updateTag(t));
  }
}
