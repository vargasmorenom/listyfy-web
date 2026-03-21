import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NetworkService } from '../../services/network.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class NoConnectionPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private networkService: NetworkService,
    private router: Router
  ) {}

  ngOnInit() {
    this.networkService.isOnline$.pipe(takeUntil(this.destroy$)).subscribe((isOnline) => {
      const currentUrl = this.router.url;

      if (!isOnline && currentUrl !== 'no-connection') {
        this.router.navigate(['no-connection']);
      } else if (isOnline && currentUrl === 'no-connection') {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
