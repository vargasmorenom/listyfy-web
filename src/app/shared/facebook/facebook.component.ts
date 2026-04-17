import { Component, OnInit, Input } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ViewFacebookComponent } from '../view-facebook/view-facebook.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { IonIcon, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoFacebook } from 'ionicons/icons';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
  imports: [IonIcon, IonCard, IonCardContent, DeleteContentComponent],
  standalone: true,
})
export class FacebookComponent implements OnInit {
  @Input() contenido: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(public popUp: PopupService) {
    addIcons({ logoFacebook });
  }

  ngOnInit() {}

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      videos: 'Video',
      photo: 'Foto',
      reel: 'Reel',
      posts: 'Post',
    };
    return labels[tipo] ?? tipo;
  }

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Publicación Facebook',
        message: 'Facebook',
        confirmText: '',
        id: data,
        cssClass: 'facebook-popup-modal',
      },
      ViewFacebookComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    }
  }
}
