import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackComponent } from 'src/app/shared/back/back.component';

import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { IonInfiniteScroll, IonInfiniteScrollContent, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonContent,
    CommonModule,
    BackComponent,
  ],
})
export class ContentPage implements OnInit {
  items: any[] = [];
  ini = 1;
  fin = 3;

  constructor() {
    addIcons({ heartOutline, heart });
  }
  ngOnInit() {
    this.loadItems();
  }
  loadItems() {}

  loadMore(event: any) {
    setTimeout(() => {
      this.loadItems();
      event.target.complete();
    }, 500);
  }
}
