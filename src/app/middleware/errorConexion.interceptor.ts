import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorConexionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const excludedRoutes = ['/no-connection', '/login', '/register']; // Rutas que no queremos redirigir

  return next(req).pipe(
    catchError((error) => {
      const currentUrl = router.url;

      if (error.status === 0) {
        // backend caído o sin conexión
        console.error('Error de red detectado.');

        // Evitar bucle infinito
        const isExcluded = excludedRoutes.some((route) => currentUrl.includes(route));

        if (!isExcluded) {
          router.navigate(['/no-connection']);
        }
      }

      return throwError(() => error);
    })
  );
};
