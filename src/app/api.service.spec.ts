import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { ApiService, LINKLY_API_BASE_URL } from './api.service';

describe('ApiService Unit Tests', () => {
  const apiService = Object.create(ApiService.prototype) as ApiService;

  it('extracts token properly from AuthResponse', () => {
    expect(apiService.extractToken({ accessToken: 'test-token' })).toBe('test-token');
    expect(apiService.extractToken({ token: 'fallback-token' })).toBe('fallback-token');
    expect(apiService.extractToken({ data: { accessToken: 'nested-token' } })).toBe('nested-token');
    expect(apiService.extractToken({})).toBeNull();
  });

  it('extracts user object properly', () => {
    const userObj = { id: '123', email: 'user@example.com', workspaceName: 'Test Workspace' };
    expect(apiService.extractUser({ user: userObj })).toEqual(userObj);
    expect(apiService.extractUser({ data: { user: userObj } })).toEqual(userObj);
    expect(apiService.extractUser(userObj)).toEqual(userObj);
    expect(apiService.extractUser({})).toBeNull();
  });

  it('formats short URL correctly', () => {
    expect(apiService.formatShortUrl({ shortUrl: 'https://linkly.com/abcd' })).toBe('https://linkly.com/abcd');
    expect(apiService.formatShortUrl({ shortCode: 'custom123' })).toBe(`${LINKLY_API_BASE_URL}/custom123`);
  });

  it('formats error messages correctly', () => {
    expect(apiService.extractErrorMessage(new Error('Generic error'))).toBe('Request failed. Please try again.');
  });
});
