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
  selector: 'app-view-linkedin',
  templateUrl: './view-linkedin.component.html',
  styleUrls: ['./view-linkedin.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewLinkedinComponent implements OnInit {
  public id: any;
  postId!: string;
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
    this.postId = this.id.idpost ?? this.id.id;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl.linkedin(this.id));
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }
}
