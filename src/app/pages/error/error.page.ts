import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule],
})
export class ErrorPage implements OnInit {
  errorTitle = 'Ha ocurrido un error';
  errorMessage = 'Intenta de nuevo más tarde.';

  constructor(private route: ActivatedRoute) {
    const type = this.route.snapshot.queryParamMap.get('type');
    if (type === '404') {
      this.errorTitle = 'Página no encontrada';
      this.errorMessage = 'La ruta solicitada no existe.';
    } else if (type === '500') {
      this.errorTitle = 'Error del servidor';
      this.errorMessage = 'Ocurrió un problema con el servidor.';
    }
  }

  ngOnInit() {}
}
