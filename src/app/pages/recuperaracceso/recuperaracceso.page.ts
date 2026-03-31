import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { RecaptchaComponent } from 'src/app/shared/recaptcha/recaptcha.component';
import { PasswordRulesComponent } from 'src/app/shared/password-rules/password-rules.component';
import { PASSWORD_PATTERN } from 'src/app/utils/password.utils';
import CryptoJS from 'crypto-js';

import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, mailOutline, keyOutline, arrowBackOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-recuperaracceso',
  templateUrl: './recuperaracceso.page.html',
  styleUrls: ['./recuperaracceso.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonButton,
    IonIcon,
    IonSpinner,
    RecaptchaComponent,
    PasswordRulesComponent,
  ],
})
export class RecuperaraccesoPage implements OnDestroy {
  @ViewChild('recaptchaRef') recaptchaRef!: RecaptchaComponent;

  backgroundClasses = ['background-1', 'background-2', 'background-3'];
  currentBackgroundClass = this.backgroundClasses[0];
  currentIndex = 0;
  private bgInterval!: ReturnType<typeof setInterval>;
  private destroy$ = new Subject<void>();
  private encryptKey = environment.servicio[0].key;

  logo = environment.servicio[0].logoHeaderInscription;
  step: 1 | 2 = 1;
  loading = false;
  recaptchaToken: string | null = null;
  emailSent = '';

  emailForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,
    private loginService: LoginService,
  ) {
    addIcons({ arrowForwardOutline, mailOutline, keyOutline, arrowBackOutline, lockClosedOutline });
    this.startBackgroundRotation();

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['', Validators.required],
    }, { validators: (g) => g.get('password')?.value === g.get('confirmPassword')?.value ? null : { passwordMismatch: true } });
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;
  }

  enviarEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email } = this.emailForm.value;

    this.loginService.recoveryRequest(email, this.recaptchaToken ?? '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status === 200) {
            this.emailSent = email;
            this.step = 2;
            this.toast.success('Código enviado. Revisa tu correo electrónico.');
          }
        },
        error: (err) => {
          this.loading = false;
          this.recaptchaRef.reset();
          if (err.status === 403) {
            this.toast.warning('Tu cuenta aún no está activa.');
          } else if (err.status === 404) {
            this.toast.error('No existe una cuenta con ese correo.');
          } else {
            this.toast.error('Error al enviar el código. Intenta de nuevo.');
          }
        },
      });
  }

  restablecerPassword(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { code, password } = this.resetForm.value;
    const encryptedPassword = CryptoJS.AES.encrypt(password, this.encryptKey).toString();

    this.loginService.recoveryReset(this.emailSent, code, encryptedPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status === 200) {
            this.toast.success('Contraseña actualizada. Inicia sesión.');
            setTimeout(() => this.router.navigate(['/login']), 1500);
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) {
            this.toast.error('Código incorrecto o expirado.');
          } else if (err.status === 400) {
            this.toast.error('No hay código activo o la contraseña no es válida.');
          } else if (err.status === 404) {
            this.toast.error('Correo no encontrado.');
          } else {
            this.toast.error('Error al restablecer la contraseña.');
          }
        },
      });
  }

  volverPaso1(): void {
    this.step = 1;
    this.resetForm.reset();
    this.recaptchaToken = null;
  }

  startBackgroundRotation(): void {
    this.bgInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundClasses.length;
      this.currentBackgroundClass = this.backgroundClasses[this.currentIndex];
    }, 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.bgInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
