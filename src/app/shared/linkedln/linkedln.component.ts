import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-linkedln',
  templateUrl: './linkedln.component.html',
  styleUrls: ['./linkedln.component.scss'],
})
export class LinkedlnComponent implements OnInit {
  @Input() contenido: any;
  @Input() idpost!: any;
  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(idpost: string): SafeResourceUrl {
    const url = `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${idpost}?compact=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    let i = 0;
    for (let item of this.contenido) {
      this.contenido[i]['urlfinal'] = this.getSafeUrl(item.idpost);
      i++;
    }
  }
}
