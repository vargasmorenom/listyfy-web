import { Component, OnInit, Input } from '@angular/core';
import { XTwitterComponent } from '../x-twitter/x-twitter.component';
import { InstagramComponent } from '../instagram/instagram.component';
import { FacebookComponent } from '../facebook/facebook.component';
import { YoutubeComponent } from '../youtube/youtube.component';
import { LinkedlnComponent } from '../linkedln/linkedln.component';
import { TiktokComponent } from '../tiktok/tiktok.component';
import { TelegramComponent } from '../telegram/telegram.component';

@Component({
  selector: 'app-showcontent',
  templateUrl: './showcontent.component.html',
  styleUrls: ['./showcontent.component.scss'],
  imports: [
    XTwitterComponent,
    TiktokComponent,
    FacebookComponent,
    LinkedlnComponent,
    YoutubeComponent,
    InstagramComponent,
    TelegramComponent,
  ],
  standalone: true,
})
export class ShowcontentComponent implements OnInit {
  @Input() content: Array<any> = [];
  @Input() set typecontent(value: number | string) {
    this._typecontent = Number(value);
  }
  get typecontent(): number {
    return this._typecontent;
  }
  private _typecontent: number = 0;
  @Input() idpost: string = '';
  @Input() isOwner: boolean = false;

  constructor() {}

  ngOnInit() {}
}
