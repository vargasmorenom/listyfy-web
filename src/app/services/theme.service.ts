import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

export type AppTheme = 'light' | 'dark';

const THEME_KEY = 'app_theme';
const DARK_CLASS = 'ion-palette-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme$ = new BehaviorSubject<AppTheme>('light');
  readonly theme$ = this._theme$.asObservable();

  constructor(private storage: StorageService) {}

  init(): void {
    const saved = this.storage.get(THEME_KEY) as AppTheme | null;
    const theme: AppTheme = saved === 'dark' ? 'dark' : 'light';
    this.apply(theme);
  }

  get current(): AppTheme {
    return this._theme$.getValue();
  }

  setTheme(theme: AppTheme): void {
    this.storage.set(THEME_KEY, theme);
    this.apply(theme);
  }

  toggle(): void {
    this.setTheme(this.current === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: AppTheme): void {
    this._theme$.next(theme);
    document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
  }
}
