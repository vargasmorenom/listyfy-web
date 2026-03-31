import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkService } from './services/network.service';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private wasOffline = window.location.pathname === '/no-connection';

  constructor(
    private networkService: NetworkService,
    private router: Router,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    this.languageService.init();
    this.themeService.init();
    this.networkService.isOnline$.subscribe((isOnline) => {
      if (!isOnline && !this.wasOffline) {
        this.wasOffline = true;
        this.router.navigate(['/no-connection']);
      } else if (isOnline && this.wasOffline) {
        this.wasOffline = false;
        this.router.navigate(['/']);
      }
    });
  }
}
