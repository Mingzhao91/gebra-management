import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/auth/signup/signup.component').then(
        (x) => x.SignupComponent
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
