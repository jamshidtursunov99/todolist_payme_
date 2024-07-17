import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ButtonVariant } from '@core/enums/button.enum';
import { Router } from '@angular/router';
import { RoutePaths } from '@core/enums/route.enum';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'payme-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  btnOutlinedVariant = ButtonVariant.Outlined;
  user = this.authService.getUser();

  login(): void {
    this.router.navigate([RoutePaths.Login]);
  }

  logout(): void {
    this.authService.setUser(null);
    this.user = null;
    this.router.navigate([RoutePaths.Dashboard]);
  }
}
