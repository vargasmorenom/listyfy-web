import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { UserSession } from '../interfaces/UserSession';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  UserSession!: UserSession;


  constructor(private storage: StorageService) {
    this.checkToken();
  }

  isUser(){
    this.loggedIn.next(true);
  }

  login(token: string) {
    this.storage.set('AuthToken', token);
    this.loggedIn.next(true);
  }

  logout() {
    this.storage.remove('AuthToken');
    const user = this.getSession();
    if (user) {
      this.storage.remove(user.id);
      this.storage.remove('usuario');
    }
    this.loggedIn.next(false);
  }

  checkToken(): boolean {
    const hasToken = this.storage.exists('AuthToken');
    this.loggedIn.next(hasToken);
    return hasToken;
  }

  getSession(): UserSession | null {
    return this.storage.get('usuario');
  }

  getProfile(): any | null {
    const user = this.getSession();
    if (!user) return null;
    return this.storage.get(user.id);
  }

  isSessionValid(): boolean {
    const user = this.getSession();
    if (!user) return false;
    return this.storage.exists(user.id);
  }

  getToken(): string | null {
    return this.storage.get('AuthToken');
  }
}
