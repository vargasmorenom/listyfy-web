import { CanActivateFn,Router } from '@angular/router';
import { Injectable,inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';


export const profileGuardGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const storage = inject(StorageService);
  const router = inject(Router);

  const paramId = route.queryParamMap.get('id');
  const sessionValid = authService.isSessionValid();
  const user = storage.get('usuario');

  if (paramId) return true;

  if (!sessionValid) {
    router.parseUrl('/');
    return false;
  }


  return true;
};
