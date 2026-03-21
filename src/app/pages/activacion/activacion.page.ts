import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
  IonButton,
} from '@ionic/angular/standalone';
import { ActivacionService } from 'src/app/services/activacion.service';

type Estado = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-activacion',
  templateUrl: './activacion.page.html',
  styleUrls: ['./activacion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonSpinner,
    IonButton,
    CommonModule,
  ],
})
export class ActivacionPage implements OnInit, OnDestroy {
  estado: Estado = 'loading';
  mensaje = '';
  imagen = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activacion: ActivacionService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const username = this.route.snapshot.queryParamMap.get('username');

    if (!token || !username) {
      this.estado = 'error';
      this.mensaje = 'Enlace de activación inválido o incompleto.';
      this.imagen = 'VQqjQDiECNtjlCc9A1Tqtj1AyUUSkisXHymq.gif';
      return;
    }

    this.activacion
      .seachActivation({ token, username })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.estado = 'success';
          this.mensaje = '¡Tu cuenta ha sido activada! Redirigiendo al login...';
          this.imagen = '484091569012201.gif';
          setTimeout(() => this.router.navigate(['/login']), 5000);
        },
        error: () => {
          this.estado = 'error';
          this.mensaje = 'No fue posible activar la cuenta. El enlace puede ser inválido o ya fue usado.';
          this.imagen = 'VQqjQDiECNtjlCc9A1Tqtj1AyUUSkisXHymq.gif';
        },
      });
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
