import { Component, OnInit, Input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { PopupService } from 'src/app/services/popup.service';
import { ViewTwitterComponent } from '../view-twitter/view-twitter.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IonIcon, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-x-twitter',
  templateUrl: './x-twitter.component.html',
  styleUrls: ['./x-twitter.component.scss'],
  standalone: true,
  imports: [SlicePipe, TranslatePipe, IonIcon, IonCard, IonCardContent, DeleteContentComponent],
})
export class XTwitterComponent implements OnInit {
  @Input() contenido!: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(public popUp: PopupService) {}

  ngOnInit() {}

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Tweet',
        message: 'Twitter',
        confirmText: '',
        id: data,
        cssClass: 'twitter-popup-modal',
      },
      ViewTwitterComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    }
  }
}
