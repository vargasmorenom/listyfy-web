import { Component, OnInit, OnDestroy } from '@angular/core';
import { addIcons } from 'ionicons';
import { menuOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { MenuStateService } from 'src/app/services/menu-state.service';
import { IonHeader, IonImg, IonIcon, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [CommonModule, IonHeader, IonImg, IonIcon, IonButton],
})
export class SessionComponent implements OnInit, OnDestroy {
  logoHeader = environment.servicio[0].logoHeader;
  isLoggedIn = false;
  private sub!: Subscription;

  constructor(
    private authService: AuthService,
    private menuState: MenuStateService,
  ) {
    addIcons({ menuOutline });
  }

  ngOnInit() {
    this.sub = this.authService.isLoggedIn$.subscribe(val => this.isLoggedIn = val);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  abrirMenu() {
    this.menuState.toggleSideMenu();
  }
}
