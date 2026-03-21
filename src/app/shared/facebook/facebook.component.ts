import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
  imports: [DeleteContentComponent],
  standalone: true,
})
export class FacebookComponent implements OnInit, AfterViewInit {
  @Input() contenido: any;
  @Input() ancho: any;
  @Input() alto: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;
  safeUrl!: SafeResourceUrl;
  safeUrl1!: SafeResourceUrl;
  safeUrl2!: SafeResourceUrl;

  ngAfterViewInit() {
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse(document.getElementById('fb-post-container'));
    }
  }
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    let i = 0;
    for (let item of this.contenido) {
      if (item.listas.tipo == 'videos') {
        const url =
          'https://www.facebook.com/v18.0/plugins/post.php?app_id=&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfbe225c4dd5cf8627%26domain%3Dlocalhost%26is_canvas%3Dfalse%26origin%3Dhttp%253A%252F%252Flocalhost%253A8100%252Ffc59bd2cca9899bab%26relation%3Dparent.parent&container_width=394&href=https%3A%2F%2Fwww.facebook.com%2Fwatch%3Fv%3D' +
          item.listas.id +
          '&locale=en_US&sdk=joey&show_text=true';
        // 👇 Angular ya no lo marca como inseguro
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.contenido[i].listas['urlfinal'] = this.safeUrl;
      }
      if (item.listas.tipo == 'photo') {
        const url1 =
          'https://www.facebook.com/v18.0/plugins/post.php?app_id=&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfe4413cffa090f693%26domain%3Dlocalhost%26is_canvas%3Dfalse%26origin%3Dhttp%253A%252F%252Flocalhost%253A8100%252Ffb9c7fa4e106b7165%26relation%3Dparent.parent&amp;container_width=394&amp;href=https%3A%2F%2Fwww.facebook.com%2Fphoto.php%3Ffbid%3D' +
          item.listas.id +
          '%26set%3D' +
          item.listas.id1 +
          '%26type%3D3%26ref%3Dembed_post&amp;locale=en_US&amp;sdk=joey&amp;show_text=true';
        // 👇 Angular ya no lo marca como inseguro
        this.safeUrl1 = this.sanitizer.bypassSecurityTrustResourceUrl(url1);
        this.contenido[i].listas['urlfinal'] = this.safeUrl1;
      }
      if (item.listas.tipo == 'reel') {
        const url2 =
          'https://www.facebook.com/plugins/video.php?height=476&href=https://www.facebook.com/reel/' +
          item.listas.id +
          '/&show_text=false&width=267&t=0';
        // 👇 Angular ya no lo marca como inseguro
        this.safeUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(url2);
        this.contenido[i].listas['urlfinal'] = this.safeUrl2;
      }
      i++;
    }
  }
}
