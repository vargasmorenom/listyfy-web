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
  IonIcon,
} from '@ionic/angular/standalone';
import { EmbedUrlService } from 'src/app/services/embed-url.service';

@Component({
  selector: 'app-view-telegram',
  templateUrl: './view-telegram.component.html',
  styleUrls: ['./view-telegram.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewTelegramComponent implements OnInit {
  public id: any;
  postRef!: string;   // formato: "canal/numeroPost"
  loading = true;
  safeUrl!: SafeResourceUrl;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private embedUrl: EmbedUrlService
  ) {}

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.postRef = this.id.id;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl.telegram(this.id));
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }
}
