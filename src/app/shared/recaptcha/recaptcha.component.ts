import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  NgZone,
} from '@angular/core';
import { environment } from 'src/environments/environment';

declare const grecaptcha: any;

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.scss'],
  standalone: true,
})
export class RecaptchaComponent implements AfterViewInit, OnDestroy {
  @ViewChild('recaptchaEl') recaptchaEl!: ElementRef;
  @Output() resolved = new EventEmitter<string | null>();

  private widgetId: number | null = null;
  private readonly siteKey: string = environment.servicio[0].recaptchaSiteKey;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.loadScript().then(() => {
      grecaptcha.ready(() => {
        this.widgetId = grecaptcha.render(this.recaptchaEl.nativeElement, {
          sitekey: this.siteKey,
          callback: (token: string) =>
            this.zone.run(() => this.resolved.emit(token)),
          'expired-callback': () =>
            this.zone.run(() => this.resolved.emit(null)),
        });
      });
    });
  }

  reset(): void {
    if (this.widgetId !== null) {
      grecaptcha.reset(this.widgetId);
    }
    this.resolved.emit(null);
  }

  private loadScript(): Promise<void> {
    const SCRIPT_URL =
      'https://www.google.com/recaptcha/api.js?render=explicit';
    if ((window as any).grecaptcha) return Promise.resolve();
    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if ((window as any).grecaptcha) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  ngOnDestroy(): void {}
}
