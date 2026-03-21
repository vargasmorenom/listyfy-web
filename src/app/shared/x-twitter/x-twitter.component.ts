import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DeleteContentComponent } from '../delete-content/delete-content.component';


@Component({
  selector: 'app-x-twitter',
  templateUrl: './x-twitter.component.html',
  styleUrls: ['./x-twitter.component.scss'],
  standalone: true,
  imports: [ DeleteContentComponent],
})
export class XTwitterComponent implements OnInit, AfterViewInit {
  @Input() contenido!: any;
  @Input() idpost!: any;
  @Input() session: boolean = false;

  constructor(public messToast: ToastrService, private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadTwitterWidgets();
  }

  private loadTwitterWidgets() {
    const twttr = (window as any).twttr;
    if (twttr?.widgets?.load) {
      twttr.widgets.load(this.el.nativeElement);
    }
  }

  borrarXtw() {}
}
