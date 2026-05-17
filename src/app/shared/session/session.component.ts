import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  menuOutline, logOutOutline, homeOutline, searchOutline,
  addCircle, analyticsOutline, personCircleOutline, personAddOutline, logInOutline,
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonImg, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TranslatePipe } from '@ngx-translate/core';
import { menuactivo } from 'src/app/configs/menuSession';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonButton, IonImg, IonIcon, TranslatePipe],
})
export class SessionComponent implements OnInit, OnDestroy {
  logoHeader = environment.servicio[0].logoHeader;
  appName = environment.servicio[0].appName;
  isLoggedIn = false;
  menuItems: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private menuState: MenuStateService,
    private router: Router,
  ) {
    addIcons({
      menuOutline, logOutOutline, homeOutline, searchOutline,
      addCircle, analyticsOutline, personCircleOutline, personAddOutline, logInOutline,
    });
  }

  ngOnInit() {
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.isLoggedIn = val;
      this.menuItems = menuactivo.filter(item => {
        if (item.visibility === 'public') return true;
        if (item.visibility === 'auth') return val;
        if (item.visibility === 'guest') return !val;
        return false;
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  abrirMenu() {
    this.menuState.toggleSideMenu();
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  doLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
