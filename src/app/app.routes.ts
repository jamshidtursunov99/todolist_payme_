import { LayoutComponent } from '@shared/components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoutePaths } from '@core/enums/route.enum';
import { Routes } from '@angular/router';
import { dashboarGuard } from '@core/guards/dashboard.guard';
import { authGuard } from '@core/guards/auth.guard';

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
        canActivate: [dashboarGuard],
      },
      {
        path: RoutePaths.TodoList,
        loadComponent: () =>
          import('./pages/todo-list/todo-list.component').then(
            (m) => m.TodoListComponent,
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: RoutePaths.Login,
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
