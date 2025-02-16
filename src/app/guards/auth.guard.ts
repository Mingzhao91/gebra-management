import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // here injecting dependencies
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuth()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
