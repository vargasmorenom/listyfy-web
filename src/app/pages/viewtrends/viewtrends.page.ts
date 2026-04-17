import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { BackComponent } from 'src/app/shared/back/back.component';
import { ContentListComponent } from 'src/app/shared/content-list/content-list.component';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { PostedsService } from '../../services/posteds.service';
import { ToastrService } from 'ngx-toastr';

import { addIcons } from 'ionicons';
import { heart, heartOutline, arrowBackOutline } from 'ionicons/icons';

import { IonInfiniteScroll, IonInfiniteScrollContent, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-viewtrends',
  templateUrl: './viewtrends.page.html',
  styleUrls: ['./viewtrends.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, BackComponent, ContentListComponent, IonInfiniteScroll, IonInfiniteScrollContent, SidebarLeftComponent, SidebarRightComponent]
})
export class ViewtrendsPage implements OnInit, OnDestroy {

  lastScrollTop = 0;
  isMenuHidden!: boolean;
  scrollTimeout: any;
  idcontent: any;
  tagName = '';
  items: any[] = [];
  ini = 1;
  fin = 3;
  private destroy$ = new Subject<void>();

  constructor(
    private posted: PostedsService,
    private param: ActivatedRoute,
    private navCtrl: NavController,
    private messToast: ToastrService,
  ) { }

  ngOnInit() {
    addIcons({ heart, heartOutline, arrowBackOutline });
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItems(id: any) {
    this.posted.getAllPostedByTag(this.ini, this.fin, id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data.length === 0 && this.items.length === 0) {
        this.messToast.info('No se encontraron publicaciones para #' + this.tagName, 'Sin contenido');
      } else {
        this.items = this.items.concat(data);
        this.ini++;
      }
    });
  }

  cargarDatos() {
    this.param.queryParams.pipe(takeUntil(this.destroy$)).subscribe((parametro: any) => {
      if (parametro['id']) {
        this.idcontent = parametro['id'];
        this.tagName = parametro['name'] || parametro['id'];
        this.loadItems(this.idcontent);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  loadMore(event: any) {
    setTimeout(() => {
      this.loadItems(this.idcontent);
      event.target.complete();
    }, 500);
  }

  onScroll(event: CustomEvent) {
    const scrollTop = event.detail.scrollTop;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    if (scrollTop > this.lastScrollTop + 1) {
      this.isMenuHidden = true;
    } else if (scrollTop < this.lastScrollTop - 1) {
      this.isMenuHidden = false;
    }

    this.scrollTimeout = setTimeout(() => {
      this.isMenuHidden = false;
    }, 300);

    this.lastScrollTop = scrollTop;
  }

}
