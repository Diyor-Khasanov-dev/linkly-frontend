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
    path: 'otp-verification',
    title: 'OTP Verification — Linkly',
    loadComponent: () =>
      import('./otp-verification/otp-verification').then((component) => component.OtpVerification),
  },
  {
    path: 'dashboard',
    title: 'Dashboard — Linkly',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard').then((component) => component.Dashboard),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'link-short' },
      {
        path: 'link-short',
        title: 'Link Short — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/link-short').then((component) => component.LinkShort),
      },
      {
        path: 'qr-code',
        title: 'QR Code — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/qr-code').then((component) => component.QrCode),
      },
      {
        path: 'analytics-link',
        title: 'Analytics Link — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/analytics-link').then((component) => component.AnalyticsLink),
      },
      {
        path: 'analytics-qr-code',
        title: 'Analytics QR Code — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/analytics-qr-code').then(
            (component) => component.AnalyticsQrCode,
          ),
      },
      {
        path: 'expiring-links',
        title: 'Expiring Links — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/expiring-links').then((component) => component.ExpiringLinks),
      },
      {
        path: 'expiring-qr-codes',
        title: 'Expiring QR Codes — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/expiring-qr-codes').then(
            (component) => component.ExpiringQrCodes,
          ),
      },
      {
        path: 'profile',
        title: 'Profile — Linkly',
        loadComponent: () =>
          import('./dashboard/pages/profile').then((component) => component.Profile),
      },
    ],
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
