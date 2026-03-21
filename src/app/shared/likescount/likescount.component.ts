import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-likescount',
  templateUrl: './likescount.component.html',
  styleUrls: ['./likescount.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class LikescountComponent implements OnInit {
  @Input() count: number = 0;
  @Input() liked: boolean = false;
  @Input() countview: number = 0;
  @Output() likeToggled = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  toggleLike() {
    this.likeToggled.emit();
  }
}
