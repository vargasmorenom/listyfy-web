import { environment } from './../../../environments/environment';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { login } from 'src/app/configs/login';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAuthService, GoogleUser } from 'src/app/services/google-auth.service';
import { RecaptchaComponent } from 'src/app/shared/recaptcha/recaptcha.component';

import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    FormsModule,
    ReactiveFormsModule,
    IonInputPasswordToggle,
    TranslatePipe,
    RecaptchaComponent,
  ],
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('recaptchaRef') recaptchaRef!: RecaptchaComponent;
  @ViewChild('googleSignInBtn') googleSignInBtn!: ElementRef<HTMLDivElement>;

  backgroundClasses: string[] = ['background-1', 'background-2', 'background-3'];
  currentBackgroundClass: string = this.backgroundClasses[0];
  currentIndex: number = 0;
  private destroy$ = new Subject<void>();
  private bgInterval!: ReturnType<typeof setInterval>;

  public formCreate: any;
  public form: FormGroup;
  private url: string;
  public logo: string;
  appName = environment.servicio[0].appName;
  recaptchaToken: string | null = null;
  recaptchaEnabled = environment.servicio[0].recaptchaEnabled;

  constructor(
    public router: Router,
    public formUl: DynamicFormService,
    public messToast: ToastrService,
    public loginservice: LoginService,
    public storage: StorageService,
    private auth: AuthService,
    private googleAuth: GoogleAuthService,
  ) {
    this.formCreate = login;
    this.url = environment.servicio[0].key;
    this.form = this.formUl.createForm(this.formCreate);
    this.logo = environment.servicio[0].logoHeaderInscription;
    this.startBackgroundRotation();
  }

  startBackgroundRotation(): void {
    this.bgInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundClasses.length;
      this.currentBackgroundClass = this.backgroundClasses[this.currentIndex];
    }, 10000);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.googleAuth.signInResult.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result.error) {
        this.messToast.warning(result.error);
        return;
      }
      if (result.user) {
        this.handleGoogleUser(result.user);
      }
    });
    this.googleAuth.renderButton(this.googleSignInBtn.nativeElement);
  }

  ngOnDestroy() {
    clearInterval(this.bgInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;
  }

  encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, this.url).toString();
  }

  enviar() {
    if (this.recaptchaEnabled && !this.recaptchaToken) {
      this.messToast.warning('Por favor completa el captcha antes de continuar');
      return;
    }

    const data = {
      username: this.form.value.username,
      password: this.encrypt(this.form.value.password),
      recaptchaToken: this.recaptchaToken,
    };

    this.loginservice.LoginUser(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (datos) => {
        console.log('[Login] Response body completo:', datos.body);
        if (datos.status === 200) {
          const token = datos.body.token;
          const usuario = { user: datos.body.usuario, id: datos.body.id, valores: token };
          this.storage.set('usuario', usuario);
          this.auth.login(token);
          this.storage.set(datos.body.id, datos.body.perfil);
          this.messToast.success('Bienvenido a ListyFy : ' + ' ' + this.form.value.username);
          setTimeout(() => {
            this.router.navigateByUrl('/', { replaceUrl: true });
          }, 2000);
        } else if (datos.status === 206) {
          this.recaptchaRef?.reset();
          this.messToast.warning('Tu cuenta aún no ha sido activada. Revisa tu correo.');
        }
      },
      error: () => {
        this.recaptchaRef?.reset();
      },
    });
  }

  private handleGoogleUser(user: GoogleUser) {
    this.loginservice.loginWithGoogle(user.idToken).pipe(takeUntil(this.destroy$)).subscribe({
      next: (datos) => {
        if (datos.status === 200) {
          const token = datos.body.token;
          const usuario = { user: datos.body.usuario, id: datos.body.id, valores: token };
          this.storage.set('usuario', usuario);
          this.auth.login(token);
          this.storage.set(datos.body.id, datos.body.perfil);
          this.messToast.success('Bienvenido a mylistys: ' + user.name);
          setTimeout(() => {
            this.router.navigateByUrl('/', { replaceUrl: true });
          }, 2000);
        }
      },
      error: () => {
        this.messToast.error('El inicio de sesión con Google aún no está disponible. Intenta más tarde.');
      },
    });
  }
}
