import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavParams } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { Router } from '@angular/router';
import { posted } from 'src/app/configs/posted';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ProfileService } from 'src/app/services/profile.service';
import { PostedsService } from 'src/app/services/posteds.service';
import { ToastrService } from 'ngx-toastr';
import { NavController } from '@ionic/angular';
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
  IonSelectOption,
  IonTextarea,
  IonItem,
  IonLabel,
  IonSelect,
  IonList,
  IonRadioGroup,
  IonRadio,
  IonCheckbox,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-editcontentlist',
  templateUrl: './editcontentlist.component.html',
  styleUrls: ['./editcontentlist.component.scss'],
  imports: [
    IonHeader,
    IonIcon,
    IonSelect,
    IonToolbar,
    IonSelectOption,
    IonList,
    IonRadioGroup,
    IonRadio,
    IonTitle,
    IonLabel,
    IonButtons,
    IonButton,
    IonInput,
    IonItem,
    IonTextarea,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    IonCheckbox,
  ],
  standalone: true,
})
export class EditcontentlistComponent implements OnInit, OnDestroy {
  title: string = '';
  public form: FormGroup = new FormGroup({});
  public formData: any;
  public fileData: any;
  public imagenCarga: any;
  public perfilId: any;
  public postId: any;
  @Input() onComplete!: (postId: string) => void;
  private destroy$ = new Subject<void>();

  constructor(
    public formUl: DynamicFormService,
    private navParams: NavParams,
    private navCtrl: NavController,
    public messToast: ToastrService,
    private modalCtrl: ModalController,
    private perfil: ProfileService,
    private storage: StorageService,
    private routes: Router,
    private posteded: PostedsService
  ) {
    this.formData = posted;
    const id = this.navParams.get('id');
    this.postId = id._id;
    this.perfilId = id.userBy;
    this.form = this.formUl.createForm(this.formData, id);

    for (let i = 0; i < id.imagen.length; i++) {
      const pic = id.imagen[i].small;
      this.imagenCarga = pic?.startsWith('http') ? pic : environment.servicio[0].urlfiles + pic;
    }

    if ((id.content?.length ?? 0) > 0) {
      this.formData = posted.filter((field: any) => field.name !== 'forKids');
    }
  }
  close() {
    this.modalCtrl.dismiss();
  }

  onfile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.includes('image')) {
        this.fileData = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imagenCarga = reader.result;
        };
      }
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  enviar() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('name', this.form.value.name);
      formData.append('description', this.form.value.description);
      formData.append('typePost', this.form.value.typePost);
      formData.append('tags', this.form.value.tags);
      formData.append('forKids', this.form.value.forKids ? 'true' : 'false');
      formData.append('access', this.form.value.access);
      formData.append('postId', this.postId);

      if (this.fileData) {
        formData.append('imagen', this.fileData, this.fileData.name);
      }

      this.posteded.updatePosted(formData).pipe(takeUntil(this.destroy$)).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.messToast.success('Contenido actualizado correctamente');
            this.modalCtrl.dismiss().then(() => {
              if (this.onComplete) {
                this.onComplete(this.postId);
              } else {
                console.warn('⚠️ onComplete no definido en @Input');
              }
            });
          } else {
            this.messToast.error('Error al actualizar el contenido');
          }
        },
        (error) => {
          console.error(error);
          this.messToast.error('Error al actualizar el contenido');
        }
      );
    } else {
      this.messToast.error('Formulario inválido');
    }
  }
}
