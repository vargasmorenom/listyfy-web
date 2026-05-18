import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean>(false);

export const erroresInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthUrl = req.url.includes('/refresh') || req.url.includes('/login');

      if (error.status === 401 && !isAuthUrl) {
        if (isRefreshing) {
          // Esperar a que el refresh en curso termine y reintentar
          return refreshDone$.pipe(
            filter((done) => done),
            take(1),
            switchMap(() => next(req))
          );
        }

        isRefreshing = true;
        refreshDone$.next(false);
        const refreshUrl = environment.servicio[0].url + 'refresh';

        return http.post(refreshUrl, {}, { withCredentials: true }).pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshDone$.next(true);
            return next(req);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            refreshDone$.next(false);
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Login y refresh manejan sus propios errores — no mostrar toast genérico aquí
      if (isAuthUrl) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 400:
          toastr.error('Datos inválidos. Verifica la información enviada.', 'Error 400');
          break;
        case 401:
          toastr.error('No autorizado. Por favor inicia sesión.', 'Error 401');
          break;
        case 403:
          toastr.error('No tienes permisos para realizar esta acción.', 'Error 403');
          break;
        case 404:
          toastr.error('El recurso solicitado no fue encontrado.', 'Error 404');
          break;
        case 409:
          toastr.warning('Token inválido, datos incorrectos o cuenta ya activa', 'Error 409');
          break;
        case 422:
          toastr.error('Los datos enviados no son válidos.', 'Error 422');
          break;
        case 500:
          toastr.error('Error interno del servidor. Intenta más tarde.', 'Error 500');
          break;
        default:
          if (error.error instanceof ErrorEvent) {
            toastr.error('Error de red. Verifica tu conexión.', 'Sin conexión');
          } else if (error.status !== 0) {
            toastr.error('Ocurrió un error inesperado. Intenta más tarde.', `Error ${error.status}`);
          }
      }

      return throwError(() => error);
    })
  );
};
