import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-click-hint',
  templateUrl: './click-hint.component.html',
  styleUrls: ['./click-hint.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ClickHintComponent {
  private static seenIds = new Set<string>();

  @Input() itemId: string = '';

  get isVisible(): boolean {
    return !ClickHintComponent.seenIds.has(this.itemId);
  }

  dismiss(event: Event) {
    event.stopPropagation();
    ClickHintComponent.seenIds.add(this.itemId);
  }
}
