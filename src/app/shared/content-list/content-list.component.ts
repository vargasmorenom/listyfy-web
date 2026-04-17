import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart, heartOutline, layersOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ContentListComponent implements OnInit {
  @Input() entityNames: Array<any> = [];
  urlfiles = environment.servicio[0].urlfiles;

  constructor(
    public navCtrl: NavController,
    private router: Router
  ) {
    addIcons({ heartOutline, heart, layersOutline });
  }

  ngOnInit() {}

  resolveImg(path: string): string {
    if (!path) return environment.servicio[0].defaultAvatar;
    if (path.startsWith('http')) return path;
    return this.urlfiles + path;
  }

  seeContent(id: string) {
    this.router.navigate(['adminlist'], {
      queryParams: { id: id },
    });
  }

  perfil(user: string) {
    this.navCtrl.navigateForward('perfil', {
      queryParams: { id: user },
    });
  }
}
