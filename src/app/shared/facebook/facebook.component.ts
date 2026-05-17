import { ClickHintComponent } from 'src/app/shared/click-hint/click-hint.component';
import { Component, OnInit, Input } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ViewFacebookComponent } from '../view-facebook/view-facebook.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
  imports: [ClickHintComponent, TranslatePipe, IonCard, IonCardContent, DeleteContentComponent],
  standalone: true,
})
export class FacebookComponent implements OnInit {
  @Input() contenido: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(public popUp: PopupService) {}

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
