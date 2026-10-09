import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-click-hint',
  templateUrl: './click-hint.component.html',
  styleUrls: ['./click-hint.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe],
})
export class ClickHintComponent {
  private static seenIds = new Set<string>();

  @Input() itemId: string = '';

  get isVisible(): boolean {
    return !ClickHintComponent.seenIds.has(this.itemId);
  }

  dismiss() {
    ClickHintComponent.seenIds.add(this.itemId);
  }
}
