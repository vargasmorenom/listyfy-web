import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

export type AppLanguage = 'en' | 'es';

const LANGUAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE: AppLanguage = 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _language$ = new BehaviorSubject<AppLanguage>(DEFAULT_LANGUAGE);
  readonly language$ = this._language$.asObservable();

  constructor(private storage: StorageService, private translate: TranslateService) {}

  init(): void {
    const saved = this.storage.get(LANGUAGE_KEY) as AppLanguage | null;
    const lang = saved === 'en' || saved === 'es' ? saved : DEFAULT_LANGUAGE;
    this._language$.next(lang);
    this.translate.use(lang);
  }

  get current(): AppLanguage {
    return this._language$.getValue();
  }

  setLanguage(lang: AppLanguage): void {
    this._language$.next(lang);
    this.storage.set(LANGUAGE_KEY, lang);
    this.translate.use(lang);
  }
}
