import { ClickHintComponent } from 'src/app/shared/click-hint/click-hint.component';
import { Component, OnInit, Input } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ViewTelegramComponent } from '../view-telegram/view-telegram.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IonIcon, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss'],
  standalone: true,
  imports: [ClickHintComponent, TranslatePipe, IonIcon, IonCard, IonCardContent, DeleteContentComponent],
})
export class TelegramComponent implements OnInit {
  @Input() contenido!: any[];
  @Input() idpost!: string;
  @Input() session: boolean = false;

  constructor(public popUp: PopupService) {}

  ngOnInit() {}

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Mensaje Telegram',
        message: 'Telegram',
        confirmText: '',
        id: data,
        cssClass: 'telegram-popup-modal',
      },
      ViewTelegramComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    }
  }
}
