import { Component, OnInit, Input } from '@angular/core';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
  imports: [DeleteContentComponent],
  standalone: true,
})
export class YoutubeComponent implements OnInit {
  @Input() contenido: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;
  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(idpost: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${idpost}?si=1mJHjv2b8b7vX8Zp`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    let i = 0;
    for (let item of this.contenido) {
      this.contenido[i]['urlfinal'] = this.getSafeUrl(item.id);
      i++;
    }
  }
}
