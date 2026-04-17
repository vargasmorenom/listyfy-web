import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../services/storage.service';

export const authValidInterceptor: HttpInterceptorFn = (req, next) => {
  const isFormData = req.body instanceof FormData;

  const storageService = new StorageService();
  const userId = storageService.get('usuario')?.id;
  let updatedReq = req;

  // Solo agrega userBy si hay un usuario autenticado real
  if (userId && !isFormData && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const modifiedBody = {
      ...(req.body || {}),
      userBy: userId,
    };

    updatedReq = req.clone({
      body: modifiedBody,
    });
  }

  const finalReq = isFormData
    ? updatedReq.clone({ withCredentials: true })
    : updatedReq.clone({
        withCredentials: true,
        setHeaders: { 'Content-Type': 'application/json' },
      });

  return next(finalReq);
};
