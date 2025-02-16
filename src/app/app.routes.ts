import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/products.component').then(
        (x) => x.ProductsComponent
      ),
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
