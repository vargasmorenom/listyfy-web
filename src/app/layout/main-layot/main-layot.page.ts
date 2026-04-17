import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SessionComponent } from 'src/app/shared/session/session.component';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { menuactivo } from 'src/app/configs/menuSession';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  homeOutline, searchOutline, addCircle, analyticsOutline,
  personCircleOutline, personAddOutline, logInOutline,
  logOutOutline, settingsOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-main-layot',
  templateUrl: './main-layot.page.html',
  styleUrls: ['./main-layot.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, SessionComponent],
})
export class MainLayotPage implements OnInit, OnDestroy {
  isLoggedIn = false;
  sideMenuOpen = false;
  menuItems: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private menuState: MenuStateService,
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({
      homeOutline, searchOutline, addCircle, analyticsOutline,
      personCircleOutline, personAddOutline, logInOutline,
      logOutOutline, settingsOutline,
    });
  }

  ngOnInit() {
    this.menuState.sideMenuOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      this.sideMenuOpen = open;
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

  closeMenu() {
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
