import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuHidden = new BehaviorSubject<boolean>(false);
  menuHidden$ = this.menuHidden.asObservable();

  setMenuHidden(hidden: boolean) {
    this.menuHidden.next(hidden);
  }
}
