import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { catchError, switchMap } from 'rxjs';
import { throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Get the currentUser from localStorage and extract the token
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const accessToken = currentUser?.token;

  let modifiedRequest = req;

  // If the token exists, add it to the request headers
  if (accessToken) {
    modifiedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

  }

  return next(modifiedRequest).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return authService.refreshToken().pipe(
          switchMap((response: any) => {


             var value_json = JSON.parse(localStorage.getItem('currentUser') || '{}');
              value_json.token = response.token;

            localStorage.setItem('currentUser', JSON.stringify(value_json));

            const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const token = user.token;


            const newRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });

            
            return next(newRequest);
          })
        );
      }
      return throwError(error); 
    })
  );
};
