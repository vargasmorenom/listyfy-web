import { environment } from './../../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { posted } from '../../configs/posted';
import { BackComponent } from 'src/app/shared/back/back.component';
import { PostedsService } from 'src/app/services/posteds.service';
import { StorageService } from 'src/app/services/storage.service';
import { CommonModule } from '@angular/common';
import { SidebarLeftComponent } from 'src/app/shared/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from 'src/app/shared/sidebar-right/sidebar-right.component';
import { addIcons } from 'ionicons';
import { refreshOutline, arrowForwardOutline, helpCircleOutline } from 'ionicons/icons';
import {
  IonContent, IonItem, IonInput, IonButton, IonIcon,
  IonSelect, IonLabel, IonSelectOption, IonTextarea,
  IonRadio, IonRadioGroup, IonList, IonCheckbox, IonPopover, IonSpinner,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { TagInputComponent } from 'src/app/shared/tag-input/tag-input.component';

@Component({
  selector: 'app-adminposted',
  templateUrl: './adminposted.page.html',
  styleUrls: ['./adminposted.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, IonInput, IonButton, IonLabel, IonIcon, IonSpinner,
    FormsModule, ReactiveFormsModule, IonSelect, IonSelectOption,
    IonTextarea, BackComponent, IonRadioGroup, IonRadio, IonList, IonCheckbox, IonPopover,
    TranslatePipe, CommonModule, SidebarLeftComponent, SidebarRightComponent, TagInputComponent,
  ],
})
export class AdminpostedPage implements OnInit, OnDestroy {
  public formCreate: any;
  public form: FormGroup;
  private destroy$ = new Subject<void>();
  public logo: string;
  public fileData: any;
  public imagenCarga: any;
  public imagenRequerida = false;
  loading = false;

  constructor(
    public router: Router,
    public formUl: DynamicFormService,
    public messToast: ToastrService,
    public adminPosted: PostedsService,
    private storage: StorageService,
  ) {
    this.formCreate = posted;
    this.form = this.formUl.createForm(this.formCreate);
    this.logo = environment.servicio[0].logosmall;
    addIcons({ refreshOutline, arrowForwardOutline, helpCircleOutline });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dataStorage() {
    if (this.storage.exists('usuario')) {
      const user = this.storage.get('usuario');
      return this.storage.get(user.id);
    }
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

  resetForm() {
    this.form.reset();
    this.imagenCarga = null;
    this.fileData = null;
  }

  enviar() {
    const profile = this.dataStorage();

    const dataForm = new FormData();
    dataForm.append('name', this.form.value.name);
    dataForm.append('description', this.form.value.description);
    dataForm.append('typePost', this.form.value.typePost);
    dataForm.append('tags', this.form.value.tags);
    dataForm.append('forKids', this.form.value.forKids ? 'true' : 'false');
    dataForm.append('access', this.form.value.access);
    dataForm.append('profileId', profile._id);
    dataForm.append('chanelName', profile.chanelName);
    dataForm.append('profilepic', profile.profilePic?.[0]?.small ?? '');
    dataForm.append('postedBy', profile.userBy);

    if (this.fileData) {
      dataForm.append('imagen', this.fileData);
    }

    this.loading = true;
    this.adminPosted.createPosted(dataForm).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.loading = false;
        if (data.status === 200) {
          this.messToast.success(data.body.message, 'Success');
          this.form.reset();
          this.imagenCarga = '';
          setTimeout(() => {
            this.router.navigate(['adminlist'], { queryParams: { id: data.body._id } });
          }, 1000);
        } else {
          this.messToast.error(data.body.message, 'Error');
        }
      },
      error: () => {
        this.loading = false;
        this.messToast.error('Error al crear la lista.', 'Error');
      },
    });
  }
}
