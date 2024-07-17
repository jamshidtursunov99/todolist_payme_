import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '@core/enums/route.enum';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  router = inject(Router);

  login(): void {
    this.router.navigate([RoutePaths.Login]);
  }
}
