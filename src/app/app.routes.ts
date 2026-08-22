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
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'short-urls' },
      {
        path: 'short-urls',
        title: 'Short URLs — Linkly',
        data: {
          page: {
            label: 'Short URLs',
            eyebrow: 'Short URLs',
            title: 'Create short links that feel premium',
            description:
              'Launch branded short URLs with custom aliases, campaign folders, and polished delivery states for the demo workspace.',
            metric: '248',
            metricLabel: 'active short URLs',
            action: 'Create short URL',
          },
        },
        loadComponent: () =>
          import('./dashboard/dashboard-demo-page').then(
            (component) => component.DashboardDemoPage,
          ),
      },
      {
        path: 'qr-code',
        title: 'QR Code — Linkly',
        data: {
          page: {
            label: 'QR Code',
            eyebrow: 'QR Code',
            title: 'Generate scan-ready QR experiences',
            description:
              'Design downloadable QR codes tied to every short URL, with production-ready export controls and destination previews.',
            metric: '96',
            metricLabel: 'QR codes generated',
            action: 'Generate QR code',
          },
        },
        loadComponent: () =>
          import('./dashboard/dashboard-demo-page').then(
            (component) => component.DashboardDemoPage,
          ),
      },
      {
        path: 'analytics-link',
        title: 'Link Analytics — Linkly',
        data: {
          page: {
            label: 'Analytics Link',
            eyebrow: 'Link analytics',
            title: 'Understand every click in context',
            description:
              'Monitor link clicks, referrers, devices, locations, and campaign velocity with executive-level demo reporting.',
            metric: '12.4K',
            metricLabel: 'tracked clicks',
            action: 'View link report',
          },
        },
        loadComponent: () =>
          import('./dashboard/dashboard-demo-page').then(
            (component) => component.DashboardDemoPage,
          ),
      },
      {
        path: 'analytics-qr-code',
        title: 'QR Analytics — Linkly',
        data: {
          page: {
            label: 'Analytics QR Code',
            eyebrow: 'QR analytics',
            title: 'Measure scans from offline to online',
            description:
              'See QR scan performance by placement, source, and conversion path while keeping the interface crisp and believable.',
            metric: '3,910',
            metricLabel: 'QR scans',
            action: 'Open QR analytics',
          },
        },
        loadComponent: () =>
          import('./dashboard/dashboard-demo-page').then(
            (component) => component.DashboardDemoPage,
          ),
      },
      {
        path: 'expiring-links',
        title: 'Expiring Links — Linkly',
        data: {
          page: {
            label: 'Expiring Links',
            eyebrow: 'Expiration controls',
            title: 'Schedule links that retire automatically',
            description:
              'Set time-boxed campaigns, expiry notices, and fallback destinations for links that should not live forever.',
            metric: '17',
            metricLabel: 'scheduled expirations',
            action: 'Schedule link',
          },
        },
        loadComponent: () =>
          import('./dashboard/dashboard-demo-page').then(
            (component) => component.DashboardDemoPage,
          ),
      },
      {
        path: 'expiring-qr-codes',
        title: 'Expiring QR Codes — Linkly',
        data: {
          page: {
            label: 'Expiring QR Codes',
            eyebrow: 'QR expiration',
            title: 'Control QR campaigns after launch',
            description:
              'Expire QR codes gracefully, route scans to fallback pages, and protect limited-time offline campaigns.',
            metric: '11',
            metricLabel: 'expiring QR codes',
            action: 'Schedule QR expiry',
          },
        },
        loadComponent: () =>
          import('./dashboard/dashboard-demo-page').then(
            (component) => component.DashboardDemoPage,
          ),
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
