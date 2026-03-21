import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
import { NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { profile } from '../../configs/profile';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonItem,
} from '@ionic/angular/standalone';

const ARRAY_FIELDS = ['linksString', 'socialMediaString', 'instantMessagesString'];
const MAX_ITEMS = 3;

const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const IM_REGEX = /^(whatsapp|telegram|signal|viber|line|wechat|skype|discord):\+?[0-9]{7,15}$/i;

@Component({
  selector: 'app-editprofileform',
  templateUrl: './editprofileform.component.html',
  styleUrls: ['./editprofileform.component.scss'],
  imports: [
    IonHeader,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonInput,
    IonItem,
    IonTextarea,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class EditprofileformComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public formCreate: any;
  public title!: string;
  public itemsMap: Record<string, string[]> = {};
  public touchedMap: Record<string, boolean[]> = {};

  public fileData: File | null = null;
  public imagenCarga: string | ArrayBuffer | null = null;
  public currentImageUrl: string = 'assets/logo/perfil02.png';
  private urlBack = environment.servicio[0].urlfiles;

  private destroy$ = new Subject<void>();

  constructor(
    public formUl: DynamicFormService,
    private navParams: NavParams,
    public messToast: ToastrService,
    private modalCtrl: ModalController,
    private perfil: ProfileService,
    private storage: StorageService,
    private routes: Router
  ) {
    this.formCreate = profile;
    const id = this.navParams.get('id');
    this.form = this.formUl.createForm(this.formCreate, id);

    if (id?.profilePic?.length) {
      this.currentImageUrl = this.urlBack + id.profilePic[0].medium;
    }

    ARRAY_FIELDS.forEach((fieldName) => {
      const raw: string = this.form.value[fieldName] ?? '';
      const items = raw.split(',').map((s: string) => s.trim()).filter(Boolean);
      this.itemsMap[fieldName] = items.length ? items.slice(0, MAX_ITEMS) : [''];
      this.touchedMap[fieldName] = this.itemsMap[fieldName].map(() => false);
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;
    this.fileData = file;
    const reader = new FileReader();
    reader.onload = () => { this.imagenCarga = reader.result; };
    reader.readAsDataURL(file);
  }

  addItem(fieldName: string) {
    if (this.itemsMap[fieldName].length < MAX_ITEMS) {
      this.itemsMap[fieldName] = [...this.itemsMap[fieldName], ''];
      this.touchedMap[fieldName] = [...this.touchedMap[fieldName], false];
    }
  }

  removeItem(fieldName: string, index: number) {
    const items = [...this.itemsMap[fieldName]];
    const touched = [...this.touchedMap[fieldName]];
    items.splice(index, 1);
    touched.splice(index, 1);
    this.itemsMap[fieldName] = items.length ? items : [''];
    this.touchedMap[fieldName] = touched.length ? touched : [false];
    this.syncField(fieldName);
  }

  updateItem(fieldName: string, index: number, event: any) {
    this.itemsMap[fieldName][index] = event.detail.value ?? '';
    this.syncField(fieldName);
  }

  markTouched(fieldName: string, index: number) {
    this.touchedMap[fieldName][index] = true;
  }

  getItemError(fieldName: string, value: string, index: number): string | null {
    if (!this.touchedMap[fieldName]?.[index]) return null;
    if (!value) return null;
    if (fieldName === 'linksString' || fieldName === 'socialMediaString') {
      return URL_REGEX.test(value) ? null : 'URL inválida. Debe iniciar con http:// o https://';
    }
    if (fieldName === 'instantMessagesString') {
      return IM_REGEX.test(value) ? null : 'Formato: app:número  (ej: whatsapp:3201234567)';
    }
    return null;
  }

  hasArrayErrors(): boolean {
    return ARRAY_FIELDS.some((fieldName) =>
      this.itemsMap[fieldName]?.some((v, i) => this.getItemError(fieldName, v, i) !== null)
    );
  }

  private syncField(fieldName: string) {
    const joined = this.itemsMap[fieldName].filter(Boolean).join(',');
    this.form.get(fieldName)?.setValue(joined, { emitEvent: false });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  enviar() {
    ARRAY_FIELDS.forEach((f) => {
      this.touchedMap[f] = this.itemsMap[f].map(() => true);
      this.syncField(f);
    });

    if (this.form.invalid || this.hasArrayErrors()) return;

    const iddata = this.storage.get('usuario');
    if (!iddata) { setTimeout(() => this.close(), 500); return; }

    const imageUpload$ = this.fileData
      ? (() => {
          const dataForm = new FormData();
          dataForm.append('userBy', iddata.id);
          dataForm.append('usuario', iddata.user);
          dataForm.append('imagen', this.fileData!);
          return this.perfil.updateImage(dataForm).pipe(
            catchError(() => {
              this.messToast.warning('No se pudo actualizar la imagen, pero el perfil se guardará.');
              return of(null);
            })
          );
        })()
      : of(null);

    const profileData = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      chanelName: this.form.value.chanelName,
      description: this.form.value.description,
      links: this.form.value.linksString,
      phoneNumber: this.form.value.phoneNumber,
      location: this.form.value.location,
      email: this.form.value.email,
      socialMedia: this.form.value.socialMediaString,
      instantMessages: this.form.value.instantMessagesString,
      userBy: iddata.id,
    };

    imageUpload$.pipe(
      switchMap(() => this.perfil.updateProfile(profileData)),
      takeUntil(this.destroy$)
    ).subscribe((datos: any) => {
      if (datos) {
        this.messToast.success(datos.message);
        setTimeout(() => this.close(), 1000);
        setTimeout(() => this.routes.navigate(['/perfil']), 1500);
      }
    });
  }
}
