import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const erroresInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido. Intenta más tarde.';

      switch (error.status) {
        case 400:
          toastr.error(errorMessage, 'Error 400 : Datos inválidos. Verifica tu solicitud');
          break;
        case 401:
          toastr.error(errorMessage, 'Error 401 : No autorizado');
          setTimeout(() => {
            router.navigate(['/login']); // Redirige a login
          }, 2000);
          break;
        case 404:
          toastr.error(errorMessage, 'Error 404 : Recurso no encontrado');
          break;
        case 409:
          toastr.warning('Token inválido, datos incorrectos o cuenta ya activa', 'Error 409');
          break;
        case 500:
          toastr.error(errorMessage, 'Error 500 : Error interno del servidor');
          break;
        default:
          if (error.error instanceof ErrorEvent) {
            errorMessage = 'Error de red. Verifica tu conexión.';
          }
      }

      // Lanza el error con el mensaje personalizado
      return throwError(() => new Error(errorMessage));
    })
  );
};
