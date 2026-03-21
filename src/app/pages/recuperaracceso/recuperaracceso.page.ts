import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { recuperarPass } from 'src/app/configs/recuperarPass';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { DynamicFormService } from 'src/app/services/dynamicFormService';
import { ToastrService } from 'ngx-toastr';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonInputPasswordToggle,
  IonCard,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-recuperaracceso',
  templateUrl: './recuperaracceso.page.html',
  styleUrls: ['./recuperaracceso.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    FormsModule,
    ReactiveFormsModule,
    IonInputPasswordToggle,
  ],
})
export class RecuperaraccesoPage implements OnInit, OnDestroy {
  backgroundClasses: string[] = ['background-1', 'background-2', 'background-3'];
  currentBackgroundClass: string = this.backgroundClasses[0];
  currentIndex: number = 0;
  private bgInterval!: ReturnType<typeof setInterval>;

  public formCreate: any;
  public form: FormGroup;
  private url: string;
  public logo: string;

  constructor(
    public router: Router,
    public formUl: DynamicFormService,
    public messToast: ToastrService
  ) {
    this.formCreate = recuperarPass;
    this.url = environment.servicio[0].key;
    this.form = this.formUl.createForm(this.formCreate);
    this.logo = environment.servicio[0].logo;
    this.startBackgroundRotation();
  }

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.bgInterval);
  }

  startBackgroundRotation(): void {
    this.bgInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundClasses.length;
      this.currentBackgroundClass = this.backgroundClasses[this.currentIndex];
    }, 10000);
  }

  enviar() {}
}
