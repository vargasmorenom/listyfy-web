import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

declare const google: any;

export interface GoogleUser {
  idToken: string;
  email: string;
  name: string;
  picture: string;
}

export interface GoogleSignInResult {
  user?: GoogleUser;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private initialized = false;
  readonly signInResult = new Subject<GoogleSignInResult>();

  constructor(private ngZone: NgZone) {}

  private initIfNeeded() {
    if (this.initialized) return;
    this.initialized = true;

    google.accounts.id.initialize({
      client_id: environment.servicio[0].googleClientId,
      callback: (response: { credential: string }) => {
        this.ngZone.run(() => {
          if (response.credential) {
            const payload = this.parseJwt(response.credential);
            this.signInResult.next({
              user: {
                idToken: response.credential,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
              },
            });
          } else {
            this.signInResult.next({ error: 'Inicio de sesión con Google cancelado' });
          }
        });
      },
    });
  }

  renderButton(element: HTMLElement) {
    if (typeof google === 'undefined') {
      setTimeout(() => this.renderButton(element), 400);
      return;
    }
    this.initIfNeeded();
    const width = Math.min(element.parentElement?.clientWidth ?? 320, 400);
    google.accounts.id.renderButton(element, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'outline',
      text: 'signin_with',
      size: 'large',
      locale: 'es',
      width,
    });
  }

  private parseJwt(token: string): any {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
