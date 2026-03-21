import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NavController, InfiniteScrollCustomEvent } from '@ionic/angular'
import { BackComponent } from 'src/app/shared/back/back.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {TendenciesService} from '../../services/tendencies.service';
import { IonContent, IonBadge, IonLabel, IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tendencies',
  templateUrl: './tendencies.page.html',
  styleUrls: ['./tendencies.page.scss'],
  standalone: true,
  imports: [IonContent, BackComponent, CommonModule, FormsModule, IonBadge, IonLabel, IonItem, IonList, IonInfiniteScroll, IonInfiniteScrollContent],
})
export class TendenciesPage implements OnInit, OnDestroy {
   isMenuHidden!: true;

  allTendencias: any[] = [];
  tendencias: any[] = [];
  pageSize = 20;
  allLoaded = false;
  private destroy$ = new Subject<void>();

  constructor(private TendenciesService: TendenciesService, private router: Router, private navCtrl: NavController) {}

  ngOnInit() {
    this.getTrendingTags();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTrendingTags() {
    this.TendenciesService.seachTendencies().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.allTendencias = data;
      this.tendencias = this.allTendencias.slice(0, this.pageSize);
      this.allLoaded = this.tendencias.length >= this.allTendencias.length;
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    const currentLength = this.tendencias.length;
    const nextBatch = this.allTendencias.slice(currentLength, currentLength + this.pageSize);
    this.tendencias = [...this.tendencias, ...nextBatch];
    this.allLoaded = this.tendencias.length >= this.allTendencias.length;
    event.target.complete();
  }

  openTendency(t: any) {
    this.navCtrl.navigateForward('/viewtrends', {
      queryParams: { id: t.id, name: t.name },
    });
  }
}
