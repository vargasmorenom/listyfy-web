import { Component, OnInit, Input } from '@angular/core';
import { IonIcon, IonList, IonItem, IonLabel, IonListHeader } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';

import { addIcons } from 'ionicons';
import { person, mail, location, arrowForwardOutline, close, people, heart, images, call } from 'ionicons/icons';

@Component({
  selector: 'app-info-perfil',
  templateUrl: './info-perfil.component.html',
  styleUrls: ['./info-perfil.component.scss'],
  imports: [IonIcon, IonList, IonItem, IonLabel, IonListHeader, TranslatePipe],
})
export class InfoPerfilComponent implements OnInit {
  @Input() perfilSession: any;

  constructor(private storage: StorageService) {
    addIcons({ person, mail, location, call, close, arrowForwardOutline, images, people, heart });
  }

  ngOnInit() {}
}
