import { ClickHintComponent } from 'src/app/shared/click-hint/click-hint.component';
import { Component, OnInit, Input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { PopupService } from 'src/app/services/popup.service';
import { ViewYoutubeComponent } from '../view-youtube/view-youtube.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
  imports: [ClickHintComponent, SlicePipe, TranslatePipe, IonCard, IonCardContent, DeleteContentComponent],
  standalone: true,
})
export class YoutubeComponent implements OnInit {
  @Input() contenido: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(public popUp: PopupService) {}

  ngOnInit() {}

  getThumbnail(item: any): string {
    return item.thumbnail ?? `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`;
  }

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Video YouTube',
        message: 'YouTube',
        confirmText: '',
        id: data,
        cssClass: 'youtube-popup-modal',
      },
      ViewYoutubeComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    }
  }
}
