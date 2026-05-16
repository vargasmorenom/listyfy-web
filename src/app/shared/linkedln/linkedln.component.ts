import { Component, OnInit, Input } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ViewLinkedinComponent } from '../view-linkedin/view-linkedin.component';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-linkedln',
  templateUrl: './linkedln.component.html',
  styleUrls: ['./linkedln.component.scss'],
  standalone: true,
  imports: [TranslatePipe, IonCard, IonCardContent, DeleteContentComponent],
})
export class LinkedlnComponent implements OnInit {
  @Input() contenido: any;
  @Input() idpost!: any;

  constructor(public popUp: PopupService) {}

  ngOnInit() {}

  async viewcontent(data: any) {
    const result = await this.popUp.showPopupDinamic(
      {
        title: 'Ver Publicación LinkedIn',
        message: 'LinkedIn',
        confirmText: '',
        id: data,
        cssClass: 'linkedin-popup-modal',
      },
      ViewLinkedinComponent
    );

    if (result?.cancelled) {
      console.warn('Modal no se abrió porque ya existía uno');
    }
  }
}
