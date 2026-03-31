import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NavController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { BackComponent } from 'src/app/shared/back/back.component';
import { FormsModule } from '@angular/forms';
import { TendenciesService } from '../../services/tendencies.service';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { PredictionFacade } from '../../facade/prediction.facade';
import {
  IonContent, IonBadge, IonLabel, IonItem, IonList,
  IonInfiniteScroll, IonInfiniteScrollContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tendencies',
  templateUrl: './tendencies.page.html',
  styleUrls: ['./tendencies.page.scss'],
  standalone: true,
  imports: [
    IonContent, BackComponent, CommonModule, FormsModule,
    IonBadge, IonLabel, IonItem, IonList,
    IonInfiniteScroll, IonInfiniteScrollContent,
    SidebarLeftComponent, SidebarRightComponent,
    IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle
  ],
})
export class TendenciesPage implements OnInit, OnDestroy {
  allTendencias: any[] = [];
  tendencias: any[] = [];
  pageSize = 20;
  allLoaded = false;
  private destroy$ = new Subject<void>();

  predictions: number[][] = [];
  topNumbers: { num: number, freq: number }[] = [];

  constructor(
    private TendenciesService: TendenciesService,
    private navCtrl: NavController,
    private predictionFacade: PredictionFacade
  ) {}

  ngOnInit() {
    this.getTrendingTags();
    this.predictionFacade.predictions$.pipe(takeUntil(this.destroy$)).subscribe(predictions => {
      this.predictions = predictions;
    });
    this.predictionFacade.topNumbers$.pipe(takeUntil(this.destroy$)).subscribe(topNumbers => {
      this.topNumbers = topNumbers;
    });
    this.predictionFacade.loadTopNumbers();
    this.predictionFacade.generatePredictions(5);
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

  generateNewPredictions() {
    this.predictionFacade.generatePredictions(5);
  }
}
