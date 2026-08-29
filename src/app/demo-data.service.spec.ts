import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { DemoDataService } from './demo-data.service';

describe('DemoDataService', () => {
  let service: DemoDataService;

  beforeEach(() => {
    service = new DemoDataService();
  });

  it('should initialize with default demo state', () => {
    expect(service.qrCodes().length).toBeGreaterThan(0);
    expect(service.expiringLinks().length).toBeGreaterThan(0);
    expect(service.expiringQrs().length).toBeGreaterThan(0);
    expect(service.referrers().length).toBeGreaterThan(0);
  });

  it('should allow adding new QR code', () => {
    const initialCount = service.qrCodes().length;
    service.addQrCode('Test QR', 'https://example.com/test', '#ff5a3d', '#ffffff');
    expect(service.qrCodes().length).toBe(initialCount + 1);
    expect(service.qrCodes()[0].title).toBe('Test QR');
  });

  it('should allow deleting a QR code', () => {
    const firstId = service.qrCodes()[0].id;
    service.deleteQrCode(firstId);
    expect(service.qrCodes().find((q) => q.id === firstId)).toBeUndefined();
  });

  it('should allow adding an expiring link and extending expiration', () => {
    const newLink = service.addExpiringLink('Promo Link', 'https://example.com/promo', 5, 100);
    expect(newLink.title).toBe('Promo Link');

    const originalExp = newLink.expiresAt.getTime();
    service.extendLinkExpiration(newLink.id, 7);

    const updatedLink = service.expiringLinks().find((l) => l.id === newLink.id);
    expect(updatedLink?.expiresAt.getTime()).toBeGreaterThan(originalExp);
    expect(updatedLink?.status).toBe('active');
  });

  it('should allow adding an expiring QR and deleting it', () => {
    const newQr = service.addExpiringQr('Event Badge', 'https://example.com/event', 2, 50);
    expect(newQr.title).toBe('Event Badge');

    service.deleteExpiringQr(newQr.id);
    expect(service.expiringQrs().find((q) => q.id === newQr.id)).toBeUndefined();
  });
});
