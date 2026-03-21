import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { environment } from 'src/environments/environment';

export const authValidInterceptor: HttpInterceptorFn = (req, next) => {
  const isFormData = req.body instanceof FormData;

  const storageService = new StorageService();
  const user = storageService.get('usuario')?.id || 'defaultUserId';
  let updatedReq = req;

  // Solo modifica el body si NO es FormData y el método permite body
  if (!isFormData && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const modifiedBody = {
      ...(req.body || {}),
      userBy: user, // ✅ Aquí agregas tu parámetro
    };

    updatedReq = req.clone({
      body: modifiedBody,
    });
  }

  // Agrega headers comunes si no es FormData
  const finalReq = updatedReq.clone({
    withCredentials: true,
    ...(isFormData
      ? {}
      : {
          setHeaders: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Origin': environment.servicio[0].appUrl,
            'Cross-Origin-Resource-Policy': 'cross-origin',
          },
        }),
  });

  return next(finalReq);
};
