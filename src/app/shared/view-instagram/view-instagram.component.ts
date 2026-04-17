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

@Component({
  selector: 'app-view-instagram',
  templateUrl: './view-instagram.component.html',
  styleUrls: ['./view-instagram.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewInstagramComponent implements OnInit {
  public id: any;
  postId!: string;
  loading = true;
  safeUrl!: SafeResourceUrl;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.postId = this.id.id;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.instagram.com/p/${this.postId}/embed/`
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }
}
