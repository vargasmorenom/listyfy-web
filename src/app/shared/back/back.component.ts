import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class BackComponent {
  constructor(private location: Location, private router: Router) {
    addIcons({ arrowBackOutline });
  }

  goBack() {
    const currentState = this.location.getState() as any;
    if (currentState?.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
