import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuHidden = new BehaviorSubject<boolean>(false);
  menuHidden$ = this.menuHidden.asObservable();

  private sideMenuOpen = new BehaviorSubject<boolean>(false);
  sideMenuOpen$ = this.sideMenuOpen.asObservable();

  setMenuHidden(hidden: boolean) {
    this.menuHidden.next(hidden);
  }

  toggleSideMenu() {
    this.sideMenuOpen.next(!this.sideMenuOpen.getValue());
  }

  closeSideMenu() {
    this.sideMenuOpen.next(false);
  }
}
