import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/auth/signup/signup.component').then(
        (x) => x.SignupComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (x) => x.LoginComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import(
        './components/products-dashboard/products-dashboard.component'
      ).then((x) => x.ProductsDashboardComponent),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./components/customers/customers.component').then(
        (x) => x.CustomersComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/orders/orders.component').then(
        (x) => x.OrdersComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
