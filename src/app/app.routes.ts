import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './components/products-dashboard/products-dashboard.component'
      ).then((x) => x.ProductsDashboardComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
