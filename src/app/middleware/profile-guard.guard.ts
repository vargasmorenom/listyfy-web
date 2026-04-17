import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const profileGuardGuard: CanActivateFn = (route, _state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const paramId = route.queryParamMap.get('id');
  const sessionValid = authService.isSessionValid();

  if (paramId) return true;

  if (!sessionValid) {
    router.navigate(['/login']);
    return false;
  }


  return true;
};
