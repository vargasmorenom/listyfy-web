import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ContentListComponent } from 'src/app/shared/content-list/content-list.component';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { PostedsService } from '../services/posteds.service';
import { MenuStateService } from '../services/menu-state.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IonInfiniteScroll, IonInfiniteScrollContent, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ContentListComponent,
    IonContent,
    CommonModule,
    SidebarLeftComponent,
    SidebarRightComponent,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonContent) ionContent!: IonContent;
  items: any[] = [];
  ini = 1;
  fin = 3;
  allLoaded = false;
  private routerSub?: Subscription;

  constructor(
    private posted: PostedsService,
    private menuState: MenuStateService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadItems();
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter((e: any) => e.urlAfterRedirects === '/' || e.urlAfterRedirects === '/home')
    ).subscribe(() => this.scrollToLastViewed());
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private async scrollToLastViewed() {
    const saved = localStorage.getItem('lastScrollPosition');
    if (!saved) return;
    const scrollTop = parseInt(saved, 10);
    setTimeout(() => {
      this.ionContent.scrollToPoint(0, scrollTop, 0);
      localStorage.removeItem('lastScrollPosition');
    }, 50);
  }

  loadItems(event?: any) {
    this.posted.getAllPosted(this.ini, this.fin).subscribe((data: any) => {
      if (!data || data.length === 0) {
        this.allLoaded = true;
      } else {
        this.items = this.items.concat(data);
        this.ini++;
      }
      event?.target.complete();
    });
  }

  loadMore(event: any) {
    this.loadItems(event);
  }

  lastScrollTop = 0;
  scrollTimeout: any;

  onScroll(event: CustomEvent) {
    const scrollTop = event.detail.scrollTop;

    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    if (scrollTop > this.lastScrollTop + 1) {
      this.menuState.setMenuHidden(true);
    } else if (scrollTop < this.lastScrollTop - 1) {
      this.menuState.setMenuHidden(false);
    }

    this.scrollTimeout = setTimeout(() => {
      this.menuState.setMenuHidden(false);
    }, 300);

    this.lastScrollTop = scrollTop;
    localStorage.setItem('lastScrollPosition', String(scrollTop));
  }
}
