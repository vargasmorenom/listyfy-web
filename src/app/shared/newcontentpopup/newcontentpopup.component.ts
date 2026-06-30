import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { ToastrService } from 'ngx-toastr';
import { PostedsService } from 'src/app/services/posteds.service';
import { content } from '../../configs/content';
import { NavParams } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, addCircleOutline, alertCircleOutline, cloudUploadOutline } from 'ionicons/icons';
import {
  IonButton,
  IonItem,
  IonInput,
  IonIcon,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-newcontentpopup',
  templateUrl: './newcontentpopup.component.html',
  styleUrls: ['./newcontentpopup.component.scss'],
  imports: [
    IonButton,
    IonItem,
    IonButtons,
    IonInput,
    IonIcon,
    IonSpinner,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
  standalone: true,
})
export class NewcontentpopupComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public content: any = [];
  loading = false;
  private destroy$ = new Subject<void>();
  title: any;
  message: any;
  confirmText: any;
  id: any;
  typepost: string = 'video'; // Default typepost, can be changed based on requirements
  constructor(
    private formUl: DynamicFormService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    public messToast: ToastrService,
    private posted: PostedsService
  ) {
    addIcons({ closeOutline, addCircleOutline, alertCircleOutline, cloudUploadOutline });
    this.content = content;
    this.form = this.formUl.createForm(this.content);
  }

  ngOnInit() {
    this.id = this.navParams.get('id');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.modalCtrl.dismiss();
    this.form.reset();
  }

enviar() {
  if (!this.form.valid) {
    this.messToast.error('Formulario inválido');
    return;
  }

  const dataContenido = {
    url: this.form.value.contenid,
    titulo: this.form.value.titulo || '',
    typePost: this.id.typePost,
    postId: this.id._id,
  };

  this.loading = true;
  this.posted.addContent(dataContenido).pipe(takeUntil(this.destroy$)).subscribe({
    next: (response) => {
      this.loading = false;
      const message = response?.body?.message || 'Sin mensaje del servidor';

      switch (response.status) {
        case 200:
          this.messToast.success(message, 'Éxito');
          setTimeout(() => this.modalCtrl.dismiss({ updated: true }), 2000);
          break;

        case 201:
          this.messToast.warning(message, 'Alerta');
          break;

        case 400:
        case 404:
        case 500:
          this.messToast.error(message, 'Error');
          break;

        default:
          this.messToast.info('Respuesta inesperada');
      }
    },

    error: (error) => {
      this.loading = false;
      console.error('Error en la solicitud', error);
      this.messToast.error('Error en la solicitud', 'Error');
    }
  });
}

}
