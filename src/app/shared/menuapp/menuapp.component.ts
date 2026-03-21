import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetButton } from '@ionic/angular';
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
  ],
  standalone: true,
})
export class MenuappComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'OK';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  actionSheetButtons: ActionSheetButton[] = [
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => {},
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    },
  ];
}
