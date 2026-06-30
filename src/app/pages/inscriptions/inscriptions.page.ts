import { environment } from './../../../environments/environment';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { inscription } from '../../configs/inscription';
import { InscriptionService } from '../../services/inscription.service';
import { CountrysService } from 'src/app/services/countrys.service';
import { RecaptchaComponent } from 'src/app/shared/recaptcha/recaptcha.component';
import { PasswordRulesComponent } from 'src/app/shared/password-rules/password-rules.component';

import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonInputPasswordToggle,
  IonSpinner,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-inscriptions',
  templateUrl: './inscriptions.page.html',
  styleUrls: ['./inscriptions.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
    IonCheckbox,
    IonInputPasswordToggle,
    IonSpinner,
    TranslatePipe,
    RecaptchaComponent,
    PasswordRulesComponent,
  ],
})
export class InscriptionsPage implements OnInit, OnDestroy {
  @ViewChild('recaptchaRef') recaptchaRef!: RecaptchaComponent;

  backgroundClasses: string[] = ['background-1', 'background-2', 'background-3'];
  currentBackgroundClass: string = this.backgroundClasses[0];
  currentIndex: number = 0;
  isMenuHidden!: true;

  public formCreate: any;
  public form: FormGroup;
  private url: string;
  public logo: string;
  appName = environment.servicio[0].appName;
  public codtelefono!: string;
  private destroy$ = new Subject<void>();
  private bgInterval!: ReturnType<typeof setInterval>;
  recaptchaToken: string | null = null;
  recaptchaEnabled = environment.servicio[0].recaptchaEnabled;
  loading = false;

  countries: any[] = [];
  filtered: any[] = [];
  pp: any = [];

  constructor(
    private countrys: CountrysService,
    public router: Router,
    public formUl: DynamicFormService,
    public messToast: ToastrService,
    public register: InscriptionService
  ) {
    this.formCreate = inscription;
    this.url = environment.servicio[0].key;
    this.form = this.formUl.createForm(this.formCreate);
    this.logo = environment.servicio[0].logoHeaderInscription;
    this.startBackgroundRotation();
  }

  onSearchChange(event: any) {
    const query = event.detail.value.toLowerCase();
    this.filtered = this.countries.filter(
      (country) => country.nameES.toLowerCase().includes(query) || country.nameEN.toLowerCase().includes(query)
    );
  }

  get hasErrors(): boolean {
  return this.form && this.form.invalid && this.form.touched;
}

  selectCountry(country: any) {
    this.form.get('pais')?.setValue(country.nameES);
    this.filtered = []; // Oculta resultados
    this.codtelefono = country.phoneCode;
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken = token;
  }

  ngOnInit() {
    this.countrys.getCountries().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.countries = data;
    });

    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input) => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('readonly', 'true'); // Temporal
        setTimeout(() => input.removeAttribute('readonly'), 100);
      });
    });
  }

  startBackgroundRotation(): void {
    this.bgInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundClasses.length;
      this.currentBackgroundClass = this.backgroundClasses[this.currentIndex];
    }, 10000);
  }

  ngOnDestroy() {
    clearInterval(this.bgInterval);
    this.destroy$.next();
    this.destroy$.complete();
  }

  encrypt(password: string): string {
    return CryptoJS.AES.encrypt(password, this.url).toString();
  }

  enviar() {
    if (this.recaptchaEnabled && !this.recaptchaToken) {
      this.messToast.warning('Por favor completa el captcha antes de continuar');
      return;
    }

    if (!this.codtelefono) {
      this.messToast.warning('Selecciona un país de la lista de sugerencias');
      return;
    }

    const data = {
      username: this.form.value.username,
      phoneCountry: this.form.value.pais,
      phoneNumber: this.form.value.telefono,
      phoneCodCountry: this.codtelefono,
      email: this.form.value.email,
      password: this.encrypt(this.form.value.password),
      terms: this.form.value.checkdatos,
      recaptchaToken: this.recaptchaToken,
    };

    console.log('[Inscripcion] Payload enviado:', data);

    this.loading = true;
    this.register.increptionUser(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (datos) => {
        this.loading = false;
        console.log('[Inscripcion] Respuesta:', datos.status, datos.body);
        if (datos.status === 201) {
          this.messToast.success('Revisa tu correo para activar tu cuenta: ' + this.form.value.email);
          setTimeout(() => this.router.navigate(['/verificacion']), 2000);
        } else if (datos.status === 206) {
          this.recaptchaRef?.reset();
          this.recaptchaToken = null;
          this.messToast.warning('El username o email ya está registrado');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('[Inscripcion] Error:', err.status, err.error);
        this.recaptchaRef?.reset();
        this.recaptchaToken = null;
      },
    });
  }
}
