import { inject } from '@angular/core';
import { StorageService } from './../services/storage.service';
import { CanActivateFn, Router } from '@angular/router';

export const accesosGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const isAuth = storageService.exists('usuario');

  if (isAuth) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
