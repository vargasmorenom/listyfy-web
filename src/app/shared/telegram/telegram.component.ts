import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { DeleteContentComponent } from '../delete-content/delete-content.component';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss'],
  standalone: true,
  imports: [DeleteContentComponent],
})
export class TelegramComponent implements OnInit, AfterViewInit {
  @Input() contenido!: any[];
  @Input() idpost!: string;
  @Input() session: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadTelegramWidgets();
  }

  private loadTelegramWidgets() {
    if (!this.contenido?.length) return;

    const containers = this.el.nativeElement.querySelectorAll('.telegram-embed');
    containers.forEach((container: HTMLElement) => {
      const post = container.getAttribute('data-post');
      if (!post) return;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-post', post);
      script.setAttribute('data-width', '100%');
      script.setAttribute('data-color', '2AABEE');
      container.appendChild(script);
    });
  }
}
