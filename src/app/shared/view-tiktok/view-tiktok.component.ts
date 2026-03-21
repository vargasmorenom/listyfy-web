import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonButton,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-view-tiktok',
  templateUrl: './view-tiktok.component.html',
  styleUrls: ['./view-tiktok.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewTiktokComponent implements OnInit {
  public id: any;
  public title: String = 'Ver Contenido TikTok';
  tiktokId!: string;
  autor!: string;
  loading = true;
  safeTikTokUrl!: SafeResourceUrl;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.autor = this.id.autorlink.split('@');
    console.log(this.id);
    this.tiktokId = this.id.id;
    this.safeTikTokUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.tiktok.com/embed/v2/${this.tiktokId}`
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }

}
