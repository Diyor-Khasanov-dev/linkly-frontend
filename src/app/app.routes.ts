import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Linkly — Short Links. Big Possibilities.',
    loadComponent: () => import('./landing/landing').then((component) => component.Landing),
  },
  {
    path: 'login',
    title: 'Log in — Linkly',
    loadComponent: () => import('./login/login').then((component) => component.Login),
  },
  {
    path: 'register',
    title: 'Register — Linkly',
    loadComponent: () => import('./register/register').then((component) => component.Register),
  },
  {
    path: 'dashboard',
    title: 'Dashboard — Linkly',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard').then((component) => component.Dashboard),
  },
  {
    path: 'loading',
    title: 'Loading — Linkly',
    loadComponent: () => import('./loading/loading').then((component) => component.Loading),
  },
  {
    path: '**',
    title: 'Page not found — Linkly',
    loadComponent: () => import('./not-found/not-found').then((component) => component.NotFound),
  },
];
