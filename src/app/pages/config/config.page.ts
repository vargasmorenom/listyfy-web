import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cambioPassword } from './../../configs/cambioPassword';
import { languageSettings } from 'src/app/configs/languageSettings';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { LanguageService } from 'src/app/services/language.service';
import { ConfigService } from 'src/app/services/config.service';
import { StorageService } from 'src/app/services/storage.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonAccordion,IonAccordionGroup,IonItem,
  IonInput,IonLabel,IonIcon,IonButton,IonInputPasswordToggle,IonCard,IonCardHeader,IonCardTitle,
  IonList,IonRadio,IonRadioGroup,IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonAccordion,
    ReactiveFormsModule,IonAccordionGroup,IonItem,IonLabel,IonIcon,IonButton,IonInputPasswordToggle,
  IonInput,IonCard,IonCardHeader,IonCardTitle,IonList,IonRadio,IonRadioGroup,IonToggle]
})
export class ConfigPage implements OnInit, OnDestroy {

  public formCreate: any;
  public form!: FormGroup;
  public langua!: FormGroup;
  public language: any;
  public languageSaved = false;
  private encryptKey = environment.servicio[0].key;
  private destroy$ = new Subject<void>();

  get isDark(): boolean {
    return this.themeService.current === 'dark';
  }

  constructor(
    public formUl: DynamicFormService,
    private languageService: LanguageService,
    private configService: ConfigService,
    private storage: StorageService,
    private themeService: ThemeService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.formCreate = cambioPassword;
    this.form = this.formUl.createForm(this.formCreate);
    this.language = languageSettings;
    this.langua = this.formUl.createForm(this.language, {
      typePost: this.languageService.current
    });
  }

  enviar() {
    if (this.form.invalid) return;
    const usuario = this.storage.get('usuario');
    const data = {
      userBy: usuario?.id,
      passwordActual: CryptoJS.AES.encrypt(this.form.value.passwordActual, this.encryptKey).toString(),
      password: CryptoJS.AES.encrypt(this.form.value.password, this.encryptKey).toString(),
    };
    this.configService.changePassword(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.toast.success('Contraseña actualizada correctamente.');
        this.form.reset();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al cambiar la contraseña.';
        this.toast.error(msg);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  guardarIdioma() {
    const lang = this.langua.get('typePost')?.value;
    if (lang) {
      this.languageService.setLanguage(lang);
      this.languageSaved = true;
      setTimeout(() => (this.languageSaved = false), 2000);
    }
  }

}
