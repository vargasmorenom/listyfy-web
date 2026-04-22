import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { Router } from '@angular/router';
import { imagen } from './../../configs/imagen';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-editprofileimageform',
  templateUrl: './editprofileimageform.component.html',
  styleUrls: ['./editprofileimageform.component.scss'],
  imports: [
    IonHeader,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class EditprofileimageformComponent implements OnInit, OnDestroy {
  title: string = '';
  public formImg: FormGroup = new FormGroup({});
  private destroy$ = new Subject<void>();
  public form!: FormGroup;
  public formCreateImg: any;
  public fileData: any;
  public imagenCarga: any;
  public perfilId: any;

  constructor(
    public formUl: DynamicFormService,
    private navParams: NavParams,
    private navCtrl: NavController,
    public messToast: ToastrService,
    private modalCtrl: ModalController,
    private perfil: ProfileService,
    private storage: StorageService,
    private routes: Router
  ) {
    addIcons({ imageOutline });
    this.formCreateImg = imagen;
    const id = this.navParams.get('id');
    this.perfilId = id?.userBy;
    this.formImg = this.formUl.createForm(this.formCreateImg, id);
    const medium = id?.profilePic?.medium;
    if (medium) {
      this.imagenCarga = medium.startsWith('http') ? medium : environment.servicio[0].urlfiles + medium;
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(id: any) {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward('perfil', {
      queryParams: { id: id },
    });
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

  enviarImagen() {
    const dataForm = new FormData();
    const user = this.storage.get('usuario');

    dataForm.append('userBy', user.id);
    dataForm.append('usuario', user.user);

    if (this.fileData) {
      dataForm.append('imagen', this.fileData);
    }
    if (this.fileData) {
      this.perfil.updateImage(dataForm).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        if (data) {
          this.messToast.success(data.message);
          this.storage.set(user.id, data.perfilCreate.perfilUpdated);
          this.routes.navigate(['/perfil']);
        }
      });
    }
  }
}
