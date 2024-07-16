import { LayoutComponent } from '@shared/components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoutePaths } from '@core/enums/route.enum';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: RoutePaths.Dashboard,
        pathMatch: 'full',
      },
      {
        path: RoutePaths.Dashboard,
        component: DashboardComponent,
      },
    ],
  },
  {
    path: RoutePaths.Login,
    loadComponent: () =>
      import('./pages/login/login.component').then((mod) => mod.LoginComponent),
  },
];
