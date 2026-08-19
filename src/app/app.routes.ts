import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Linkly — Short Links. Big Possibilities.',
    loadComponent: () => import('./landing/landing').then((component) => component.Landing),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
