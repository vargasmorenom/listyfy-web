import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { getPasswordChecks } from 'src/app/utils/password.utils';

@Component({
  selector: 'app-password-rules',
  templateUrl: './password-rules.component.html',
  styleUrls: ['./password-rules.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe],
})
export class PasswordRulesComponent {
  @Input() value: string = '';

  get checks() {
    return getPasswordChecks(this.value);
  }
}
