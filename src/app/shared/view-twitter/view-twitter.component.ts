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
  selector: 'app-view-twitter',
  templateUrl: './view-twitter.component.html',
  styleUrls: ['./view-twitter.component.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonSpinner, IonIcon],
  standalone: true,
})
export class ViewTwitterComponent implements OnInit {
  public id: any;
  tweetId!: string;
  username!: string;
  loading = true;
  safeUrl!: SafeResourceUrl;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.id = this.navParams.get('id');
    this.tweetId = this.id.id;
    this.username = this.id.username ?? '';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://platform.twitter.com/embed/Tweet.html?id=${this.tweetId}`
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onIframeLoad() {
    this.loading = false;
  }
}
