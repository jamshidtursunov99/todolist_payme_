import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutePaths } from '@core/enums/route.enum';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    router.navigate([RoutePaths.Dashboard]);
    return false;
  }
  return true;
};
