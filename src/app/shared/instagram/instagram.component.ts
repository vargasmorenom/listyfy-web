import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { DeleteContentComponent } from '../delete-content/delete-content.component';
import { ScriptLoaderService } from 'src/app/services/scriptloader.service';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss'],
  standalone: true,
  imports: [DeleteContentComponent],
})
export class InstagramComponent implements OnInit, AfterViewInit {
  @Input() contenido!: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(private scriptLoader: ScriptLoaderService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scriptLoader
      .loadScript({
        url: 'https://www.instagram.com/embed.js',
        globalObject: 'instgrm',
        callbackMethodPath: 'Embeds.process',
      })
      .then(() => {
        const instgrm = (window as any).instgrm;
        instgrm?.Embeds?.process();
      });
  }
}
