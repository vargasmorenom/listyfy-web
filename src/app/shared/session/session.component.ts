import { Component, OnInit, OnDestroy } from '@angular/core';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { heart, heartOutline, apps, settingsOutline, logOutOutline, homeOutline, createOutline, personOutline } from 'ionicons/icons';
import { ActionSheetServiceService } from 'src/app/services/action-sheet-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonHeader, IonImg, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [IonHeader, IonImg, IonIcon, IonButton],
})
export class SessionComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  logoHeader = environment.servicio[0].logoHeader;
  private sub!: Subscription;

  constructor(
    private actionSheet: ActionSheetServiceService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ heartOutline, heart, apps, settingsOutline, logOutOutline, homeOutline, createOutline, personOutline });
  }

  ngOnInit() {
    this.sub = this.authService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  mostrarOpciones() {
    if (this.isLoggedIn) {
      this.actionSheet.present({
        header: 'Menú',
        buttons: [
          {
            text: 'Configuración',
            icon: 'settings-outline',
            handler: () => {
              this.router.navigate(['/config']);
            },
          },
          {
            text: 'Salir',
            role: 'destructive',
            icon: 'log-out-outline',
            handler: () => {
              this.authService.logout();
              this.router.navigate(['/login']);
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });
    } else {
      this.actionSheet.present({
        header: 'Menú',
        buttons: [
          {
            text: 'Inicio',
            icon: 'home-outline',
            handler: () => {
              this.router.navigate(['/']);
            },
          },
          {
            text: 'Inscribirse',
            icon: 'create-outline',
            handler: () => {
              this.router.navigate(['/register']);
            },
          },
          {
            text: 'Iniciar sesión',
            icon: 'person-outline',
            handler: () => {
              this.router.navigate(['/login']);
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });
    }
  }
}
