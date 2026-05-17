import { ClickHintComponent } from 'src/app/shared/click-hint/click-hint.component';
import { Component, OnInit, Input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { PopupService } from 'src/app/services/popup.service';
import { ViewInstagramComponent } from '../view-instagram/view-instagram.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss'],
  standalone: true,
  imports: [ClickHintComponent, SlicePipe, TranslatePipe, IonCard, IonCardContent, DeleteContentComponent],
})
export class InstagramComponent implements OnInit {
  @Input() contenido!: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(public popUp: PopupService) {}

  ngOnInit() {}

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Publicación Instagram',
        message: 'Instagram',
        confirmText: '',
        id: data,
        cssClass: 'instagram-popup-modal',
      },
      ViewInstagramComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    }
  }
}
