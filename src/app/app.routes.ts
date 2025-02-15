import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
