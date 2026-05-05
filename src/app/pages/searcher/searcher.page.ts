import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearcherPageService } from 'src/app/services/search.service';
import { BackComponent } from 'src/app/shared/back/back.component';
import { ContentListComponent } from 'src/app/shared/content-list/content-list.component';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { environment } from 'src/environments/environment';
import {
  IonContent, IonSearchbar, IonInfiniteScrollContent,
  IonInfiniteScroll,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.page.html',
  styleUrls: ['./searcher.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule, BackComponent,
    IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll,
    ContentListComponent, SidebarLeftComponent, SidebarRightComponent,
  ],
})
export class SearcherPage implements OnInit, OnDestroy {
  posts: any[] = [];
  channels: any[] = [];
  ini = 1;
  fin = 3;
  private readonly urlfiles = environment.servicio[0].urlfiles;
  private readonly defaultAvatar = environment.servicio[0].defaultAvatar;
  private destroy$ = new Subject<void>();

  constructor(
    private searcherPageService: SearcherPageService,
    private messToast: ToastrService,
    private router: Router,
  ) {}

  ionViewWillEnter() {
    this.onSearch({ detail: { value: '' } });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resolveImg(path: string): string {
    if (!path) return this.defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlfiles + path;
  }

  verCanal(id: string) {
    this.router.navigate(['perfil'], { queryParams: { id } });
  }

  loadMore(event: any) {
    this.ini += 3;
    this.fin += 3;
    this.searcherPageService.searchForTags(event, this.ini, this.fin).pipe(takeUntil(this.destroy$)).subscribe((results) => {
      if (results?.length) {
        this.posts = [...this.posts, ...results.filter((r: any) => r._type !== 'channel')];
      }
      event.target.complete();
    });
  }

  onSearch(event: any) {
    const query = event.detail.value?.trim() ?? '';
    if (query.length < 6) return;
    this.ini = 1;
    this.fin = 3;
    this.posts = [];
    this.channels = [];

    this.searcherPageService.searchForTags(query, this.ini, this.fin).pipe(takeUntil(this.destroy$)).subscribe({
      next: (results) => {
        if (results?.length) {
          this.channels = results.filter((r: any) => r._type === 'channel');
          this.posts    = results.filter((r: any) => r._type !== 'channel');
        } else {
          this.messToast.success('No se encontró contenido relacionado con la búsqueda', 'Sin resultados');
        }
      },
      error: () => this.messToast.error('Ocurrió un error al realizar la búsqueda', 'Error'),
    });
  }
}
