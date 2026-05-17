import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  homeOutline, searchOutline, addCircle, analyticsOutline,
  personCircleOutline, personAddOutline, logInOutline, logOutOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { menuactivo } from 'src/app/configs/menuSession';
import { SidebarLeftComponent } from '../sidebar-left/sidebar-left.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe,SidebarLeftComponent],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  appName = environment.servicio[0].appName;
  isOpen = false;
  isLoggedIn = false;
  menuItems: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private menuState: MenuStateService,
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({
      homeOutline, searchOutline, addCircle, analyticsOutline,
      personCircleOutline, personAddOutline, logInOutline, logOutOutline,
    });
  }

  ngOnInit() {
    this.menuState.sideMenuOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      this.isOpen = open;
    });

    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      this.menuItems = menuactivo.filter(item => {
        if (item.visibility === 'public') return true;
        if (item.visibility === 'auth') return isLogged;
        if (item.visibility === 'guest') return !isLogged;
        return false;
      });
    });
  }

  navigate(url: string) {
    this.menuState.closeSideMenu();
    this.router.navigate([url]);
  }

  close() {
    this.menuState.closeSideMenu();
  }

  logout() {
    this.menuState.closeSideMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
