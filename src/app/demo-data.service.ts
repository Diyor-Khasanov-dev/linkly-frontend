import { Injectable, signal, computed } from '@angular/core';

export interface DemoQrCode {
  id: string;
  title: string;
  targetUrl: string;
  fgColor: string;
  bgColor: string;
  scanCount: number;
  createdAt: string;
}

export interface ReferrerStat {
  source: string;
  clicks: number;
  percentage: number;
}

export interface CountryStat {
  country: string;
  code: string;
  clicks: number;
  percentage: number;
}

export interface DeviceStat {
  device: string;
  icon: string;
  clicks: number;
  percentage: number;
}

export interface TopLinkStat {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  trend: number;
}

export interface QrScanDevice {
  platform: string;
  scans: number;
  percentage: number;
}

export interface QrScanLocation {
  location: string;
  countryCode: string;
  scans: number;
}

export interface DemoExpiringLink {
  id: string;
  title: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt: Date;
  maxClicks: number | null;
  currentClicks: number;
  status: 'active' | 'expiring_soon' | 'expired';
}

export interface DemoExpiringQr {
  id: string;
  title: string;
  targetUrl: string;
  fgColor: string;
  bgColor: string;
  expiresAt: Date;
  maxScans: number | null;
  currentScans: number;
  status: 'active' | 'expiring_soon' | 'expired';
}

@Injectable({ providedIn: 'root' })
export class DemoDataService {
  // QR Codes state
  readonly qrCodes = signal<DemoQrCode[]>([
    {
      id: 'qr-1',
      title: 'Spring Campaign Landing Page',
      targetUrl: 'https://linkly.com/promo/spring-2025',
      fgColor: '#1d1f26',
      bgColor: '#ffffff',
      scanCount: 1420,
      createdAt: '2025-02-15',
    },
    {
      id: 'qr-2',
      title: 'Product Launch Webinar Sign-up',
      targetUrl: 'https://linkly.com/webinar/v2-launch',
      fgColor: '#ff5a3d',
      bgColor: '#ffffff',
      scanCount: 890,
      createdAt: '2025-02-20',
    },
    {
      id: 'qr-3',
      title: 'WiFi Connection & Portal Access',
      targetUrl: 'https://wifi.linkly.internal/connect',
      fgColor: '#0e9e76',
      bgColor: '#fbfaf6',
      scanCount: 2310,
      createdAt: '2025-01-10',
    },
    {
      id: 'qr-4',
      title: 'Feedback & Review Survey Form',
      targetUrl: 'https://forms.linkly.com/survey/2025',
      fgColor: '#2b303a',
      bgColor: '#ffffff',
      scanCount: 415,
      createdAt: '2025-03-01',
    },
  ]);

  // Expiring Links state
  readonly expiringLinks = signal<DemoExpiringLink[]>([
    {
      id: 'exp-link-1',
      title: 'Flash Sale 50% Off Promo Code',
      shortUrl: 'https://linkly.com/flash50',
      originalUrl: 'https://shop.brand.com/promotions/flash-sale-spring',
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // ~2 days from now
      maxClicks: 5000,
      currentClicks: 4120,
      status: 'expiring_soon',
    },
    {
      id: 'exp-link-2',
      title: 'VIP Event Early Access Pass',
      shortUrl: 'https://linkly.com/vip-pass',
      originalUrl: 'https://events.company.com/vip-pass-registration',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // ~14 days from now
      maxClicks: 1000,
      currentClicks: 320,
      status: 'active',
    },
    {
      id: 'exp-link-3',
      title: 'Limited Time Download Key',
      shortUrl: 'https://linkly.com/dl-beta-v3',
      originalUrl: 'https://cdn.software.io/downloads/beta-installer.dmg',
      expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      maxClicks: 250,
      currentClicks: 250,
      status: 'expired',
    },
    {
      id: 'exp-link-4',
      title: 'Black Friday Early Bird Discount',
      shortUrl: 'https://linkly.com/bf-early',
      originalUrl: 'https://store.linkly.com/bf-discount-claim',
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // ~36 hrs
      maxClicks: 2000,
      currentClicks: 1840,
      status: 'expiring_soon',
    },
    {
      id: 'exp-link-5',
      title: 'Internal Team Feedback Link',
      shortUrl: 'https://linkly.com/q1-review',
      originalUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc...',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxClicks: null,
      currentClicks: 94,
      status: 'active',
    },
  ]);

  // Expiring QR Codes state
  readonly expiringQrs = signal<DemoExpiringQr[]>([
    {
      id: 'exp-qr-1',
      title: 'Conference Badge Check-in QR',
      targetUrl: 'https://conf2025.com/checkin?code=VIP-88',
      fgColor: '#ff5a3d',
      bgColor: '#ffffff',
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      maxScans: 300,
      currentScans: 268,
      status: 'expiring_soon',
    },
    {
      id: 'exp-qr-2',
      title: 'Temporary Pop-up Store Menu',
      targetUrl: 'https://popup.restaurant.com/menu',
      fgColor: '#1d1f26',
      bgColor: '#ffffff',
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxScans: 5000,
      currentScans: 1430,
      status: 'active',
    },
    {
      id: 'exp-qr-3',
      title: 'One-Time Voucher Discount',
      targetUrl: 'https://coupon.store.com/redeem?token=xyz99',
      fgColor: '#0e9e76',
      bgColor: '#ffffff',
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      maxScans: 100,
      currentScans: 100,
      status: 'expired',
    },
    {
      id: 'exp-qr-4',
      title: 'Guest WiFi Guest Login Pass',
      targetUrl: 'https://wifi.hotel-hub.com/guest-auth',
      fgColor: '#2b303a',
      bgColor: '#fbfaf6',
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      maxScans: null,
      currentScans: 612,
      status: 'active',
    },
  ]);

  // Analytics Link Data
  readonly linkAnalyticsTimeframe = signal<'7d' | '30d' | '90d' | 'all'>('30d');

  readonly referrers = signal<ReferrerStat[]>([
    { source: 'Direct / None', clicks: 5420, percentage: 43.7 },
    { source: 'Google Search', clicks: 3100, percentage: 25.0 },
    { source: 'Twitter / X', clicks: 1840, percentage: 14.8 },
    { source: 'LinkedIn', clicks: 1210, percentage: 9.8 },
    { source: 'GitHub / Docs', clicks: 830, percentage: 6.7 },
  ]);

  readonly countryStats = signal<CountryStat[]>([
    { country: 'United States', code: 'US', clicks: 5240, percentage: 42.2 },
    { country: 'United Kingdom', code: 'GB', clicks: 2150, percentage: 17.3 },
    { country: 'Germany', code: 'DE', clicks: 1820, percentage: 14.6 },
    { country: 'Japan', code: 'JP', clicks: 1410, percentage: 11.3 },
    { country: 'Canada', code: 'CA', clicks: 1080, percentage: 8.7 },
    { country: 'Others', code: 'UN', clicks: 700, percentage: 5.9 },
  ]);

  readonly deviceStats = signal<DeviceStat[]>([
    { device: 'Mobile (iOS & Android)', icon: '📱', clicks: 7192, percentage: 58.0 },
    { device: 'Desktop (macOS & Windows)', icon: '💻', clicks: 4340, percentage: 35.0 },
    { device: 'Tablet (iPad / Android)', icon: '📱', clicks: 868, percentage: 7.0 },
  ]);

  readonly topPerformingLinks = signal<TopLinkStat[]>([
    {
      id: 'link-1',
      title: 'Product Launch v2 Announcement',
      shortUrl: 'https://linkly.com/v2-launch',
      originalUrl: 'https://blog.company.com/announcing-v2-features',
      clicks: 4820,
      trend: 24,
    },
    {
      id: 'link-2',
      title: 'Spring Discount Campaign',
      shortUrl: 'https://linkly.com/spring25',
      originalUrl: 'https://shop.company.com/spring-sale',
      clicks: 3410,
      trend: 18,
    },
    {
      id: 'link-3',
      title: 'Developer API Documentation',
      shortUrl: 'https://linkly.com/api-docs',
      originalUrl: 'https://docs.company.com/api/v1',
      clicks: 2290,
      trend: -5,
    },
    {
      id: 'link-4',
      title: 'Customer Onboarding Survey',
      shortUrl: 'https://linkly.com/survey',
      originalUrl: 'https://forms.typeform.com/to/xyz123',
      clicks: 1880,
      trend: 12,
    },
  ]);

  // Analytics QR Code Data
  readonly qrAnalyticsTimeframe = signal<'7d' | '30d' | 'all'>('30d');

  readonly qrScanDevices = signal<QrScanDevice[]>([
    { platform: 'iOS (Camera App & Safari)', scans: 2340, percentage: 60.0 },
    { platform: 'Android (Google Lens & Chrome)', scans: 1325, percentage: 34.0 },
    { platform: 'Other QR Readers & Web', scans: 235, percentage: 6.0 },
  ]);

  readonly qrScanLocations = signal<QrScanLocation[]>([
    { location: 'San Francisco, USA', countryCode: 'US', scans: 1120 },
    { location: 'London, UK', countryCode: 'GB', scans: 840 },
    { location: 'Berlin, Germany', countryCode: 'DE', scans: 670 },
    { location: 'Tokyo, Japan', countryCode: 'JP', scans: 590 },
    { location: 'Toronto, Canada', countryCode: 'CA', scans: 450 },
  ]);

  // Methods to modify QR codes
  addQrCode(title: string, targetUrl: string, fgColor = '#1d1f26', bgColor = '#ffffff'): DemoQrCode {
    const newQr: DemoQrCode = {
      id: `qr-${Date.now()}`,
      title: title || 'Custom QR Code',
      targetUrl,
      fgColor,
      bgColor,
      scanCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.qrCodes.update((current) => [newQr, ...current]);
    return newQr;
  }

  deleteQrCode(id: string): void {
    this.qrCodes.update((current) => current.filter((item) => item.id !== id));
  }

  // Methods to modify expiring links
  addExpiringLink(title: string, originalUrl: string, expiresAtDays: number, maxClicks: number | null): DemoExpiringLink {
    const expiresAt = new Date(Date.now() + expiresAtDays * 24 * 60 * 60 * 1000);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 12) || 'link';

    const newLink: DemoExpiringLink = {
      id: `exp-link-${Date.now()}`,
      title,
      shortUrl: `https://linkly.com/${slug}-${Math.floor(Math.random() * 899 + 100)}`,
      originalUrl,
      expiresAt,
      maxClicks: maxClicks && maxClicks > 0 ? maxClicks : null,
      currentClicks: 0,
      status: expiresAtDays <= 3 ? 'expiring_soon' : 'active',
    };

    this.expiringLinks.update((current) => [newLink, ...current]);
    return newLink;
  }

  extendLinkExpiration(id: string, additionalDays: number): void {
    this.expiringLinks.update((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const currentExp = item.expiresAt > new Date() ? item.expiresAt.getTime() : Date.now();
        const newExpiresAt = new Date(currentExp + additionalDays * 24 * 60 * 60 * 1000);
        return {
          ...item,
          expiresAt: newExpiresAt,
          status: 'active',
        };
      })
    );
  }

  deleteExpiringLink(id: string): void {
    this.expiringLinks.update((current) => current.filter((item) => item.id !== id));
  }

  // Methods to modify expiring QR codes
  addExpiringQr(title: string, targetUrl: string, expiresAtDays: number, maxScans: number | null, fgColor = '#1d1f26', bgColor = '#ffffff'): DemoExpiringQr {
    const expiresAt = new Date(Date.now() + expiresAtDays * 24 * 60 * 60 * 1000);

    const newQr: DemoExpiringQr = {
      id: `exp-qr-${Date.now()}`,
      title,
      targetUrl,
      fgColor,
      bgColor,
      expiresAt,
      maxScans: maxScans && maxScans > 0 ? maxScans : null,
      currentScans: 0,
      status: expiresAtDays <= 3 ? 'expiring_soon' : 'active',
    };

    this.expiringQrs.update((current) => [newQr, ...current]);
    return newQr;
  }

  extendQrExpiration(id: string, additionalDays: number): void {
    this.expiringQrs.update((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const currentExp = item.expiresAt > new Date() ? item.expiresAt.getTime() : Date.now();
        const newExpiresAt = new Date(currentExp + additionalDays * 24 * 60 * 60 * 1000);
        return {
          ...item,
          expiresAt: newExpiresAt,
          status: 'active',
        };
      })
    );
  }

  deleteExpiringQr(id: string): void {
    this.expiringQrs.update((current) => current.filter((item) => item.id !== id));
  }
}
