import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetButton } from '@ionic/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  IonButton,
  IonActionSheet,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menuapp',
  templateUrl: './menuapp.component.html',
  styleUrls: ['./menuapp.component.scss'],
  imports: [
    IonButton,
    IonActionSheet,
    TranslatePipe,
  ],
  standalone: true,
})
export class MenuappComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'OK';

  constructor(private modalCtrl: ModalController, private translate: TranslateService) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  actionSheetButtons: ActionSheetButton[] = [
    {
      text: this.translate?.instant('menuapp.eliminar') ?? 'Eliminar',
      role: 'destructive',
      handler: () => {},
    },
    {
      text: this.translate?.instant('menuapp.cancelar') ?? 'Cancelar',
      role: 'cancel',
    },
  ];
}
