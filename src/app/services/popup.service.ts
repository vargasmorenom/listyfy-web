import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MenuappComponent } from '../shared/menuapp/menuapp.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private modalCtrl: ModalController) {}

  async showPopup(
    options: {
      title?: string;
      message?: string;
      confirmText?: string;
    },
    popUp: any = null
  ) {
    const modal = await this.modalCtrl.create({
      component: MenuappComponent,
      componentProps: {
        title: options.title || 'Info',
        message: options.message || '',
        confirmText: options.confirmText || 'OK',
      },
      cssClass: 'custom-popup-modal',
      backdropDismiss: true,
    });
    await modal.present();
    return modal.onDidDismiss(); // puedes esperar respuesta si lo necesitas
  }

  async showPopupDinamic(
    options: {
      title?: string;
      message?: string;
      confirmText?: string;
      id: any | null;
      onComplete?: (postId: string) => void | null;
    },
    popUp: any = null
  ): Promise<any> {
    try {
      // 1. Verifica si ya hay un modal abierto
      const existingModal = await this.modalCtrl.getTop();
      if (existingModal) {
        console.warn('Ya hay un modal abierto. Cancelando apertura.');
        return { cancelled: true };
      }

      // 2. Crea y presenta el modal
      const modal = await this.modalCtrl.create({
        component: popUp,
        componentProps: {
          title: options.title || 'Info',
          message: options.message || '',
          confirmText: options.confirmText || 'OK',
          id: options.id || null,
          onComplete: options.onComplete || null,
        },
        cssClass: 'custom-popup-modal',
        backdropDismiss: true,
      });

      await modal.present();

      // 3. Espera el resultado del modal
      const result = await modal.onDidDismiss();
      return result;
    } catch (error) {
      console.error('Error al mostrar el popup:', error);
      return { error: true, message: error };
    }
  }
}
