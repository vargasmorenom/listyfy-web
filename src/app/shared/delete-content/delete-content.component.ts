import { Component, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostedsService } from 'src/app/services/posteds.service';
import { ToastrService } from 'ngx-toastr';
import { AlertController } from '@ionic/angular';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-delete-content',
  templateUrl: './delete-content.component.html',
  styleUrls: ['./delete-content.component.scss'],
  imports: [IonButton, IonIcon],
  standalone: true,
})
export class DeleteContentComponent implements OnDestroy {
  @Input() idContent!: any;
  @Input() session!: any;
  @Input() idpost!: any;

  public titulo = 'Eliminar contenido';
  private destroy$ = new Subject<void>();

  constructor(
    private messToast: ToastrService,
    private posted: PostedsService,
    private alertController: AlertController
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteContent(id: any, idpost: any) {
    this.posted.deleteContent(id, idpost).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      if (response.status === 200) {
        this.messToast.success(response.body.message, 'Éxito');
      }
      if (response.status === 400) {
        this.messToast.error(response.body.message, 'Error');
      }
    });
  }

  async presentAlert(idContent: string, idPost: string) {
    const alert = await this.alertController.create({
      header: '¿Eliminar contenido?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.deleteContent(idContent, idPost);
            this.eleminarContenido(idContent);
          },
        },
      ],
    });

    await alert.present();
  }

  eleminarContenido(id: any) {
    const div = document.getElementById(id);
    div?.remove();
  }

}
