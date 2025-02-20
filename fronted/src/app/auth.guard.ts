import { CanActivateFn } from '@angular/router';
import {  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];

  return authService.currentUser.pipe(
    map((user) => {
      if (user && user.role && allowedRoles.includes(user.role)) {
        // User is logged in and has an allowed role
        return true;
      }
      // User is not allowed or not logged in; redirect to login page
      router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};
