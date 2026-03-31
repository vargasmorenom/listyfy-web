import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
  standalone: true,
  imports: [IonContent, TranslatePipe],
})
export class NoConnectionPage {}
