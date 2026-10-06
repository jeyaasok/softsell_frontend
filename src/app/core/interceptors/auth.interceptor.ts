import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('bracezin_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    });
  } else {
    req = req.clone({
      setHeaders: {
        Accept: 'application/json',
      }
    });
  }

  return next(req);
};

