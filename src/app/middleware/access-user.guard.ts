import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { inject } from '@angular/core';

export const accessUserGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const iduser = storageService.get('usuario');

  if (iduser && storageService.exists(iduser.id)) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
