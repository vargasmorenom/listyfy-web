import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetServiceService {
  constructor(private actionSheetCtrl: ActionSheetController) {}

  async present(options: {
    header?: string;
    subHeader?: string;
    buttons: {
      text: string;
      role?: 'destructive' | 'cancel' | string;
      icon?: string;
      handler?: () => void;
    }[];
  }) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: options.header,
      subHeader: options.subHeader,
      buttons: options.buttons,
    });

    await actionSheet.present();
  }
}
