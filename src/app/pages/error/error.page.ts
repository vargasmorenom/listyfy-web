import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, TranslatePipe],
})
export class ErrorPage {
  errorCode = '';
  errorTitle = 'Ha ocurrido un error';
  errorMessage = 'Intenta de nuevo más tarde.';

  constructor(private route: ActivatedRoute, private router: Router) {
    const type = this.route.snapshot.queryParamMap.get('type');
    this.errorCode = type ?? 'Error';
    if (type === '404') {
      this.errorTitle = 'Página no encontrada';
      this.errorMessage = 'La ruta solicitada no existe.';
    } else if (type === '500') {
      this.errorTitle = 'Error del servidor';
      this.errorMessage = 'Ocurrió un problema con el servidor.';
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
