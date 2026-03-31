import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PostedsService } from 'src/app/services/posteds.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
})
export class SidebarRightComponent implements OnInit, OnDestroy {
  topViewed: any[] = [];
  topLiked: any[] = [];
  currentPostId: string | null = null;
  urlfiles = environment.servicio[0].urlfiles;
  private destroy$ = new Subject<void>();

  constructor(
    private posted: PostedsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.posted.getTopViewed(3).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data?.length) this.topViewed = data;
    });
    this.posted.getTopLiked(3).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data?.length) this.topLiked = data;
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      const urlTree = this.router.parseUrl(this.router.url);
      this.currentPostId = urlTree.queryParams['id'] ?? null;
    });

    const urlTree = this.router.parseUrl(this.router.url);
    this.currentPostId = urlTree.queryParams['id'] ?? null;
  }

  get filteredTopViewed() {
    return this.topViewed.filter(p => p._id !== this.currentPostId);
  }

  get filteredTopLiked() {
    return this.topLiked.filter(p => p._id !== this.currentPostId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
