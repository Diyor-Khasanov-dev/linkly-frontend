import '@angular/compiler';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { of, throwError } from 'rxjs';

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let mockApi: Partial<ApiService>;

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    mockApi = {
      register: vi.fn(),
      login: vi.fn(),
      verifyOtp: vi.fn(),
      logout: vi.fn().mockReturnValue(of({})),
      getMe: vi.fn().mockReturnValue(of(null)),
      extractToken: vi.fn().mockReturnValue('mock-token'),
      extractUser: vi.fn().mockReturnValue({ id: '123', email: 'test@example.com' }),
    };

    authService = Object.create(AuthService.prototype) as any;
    (authService as any).api = mockApi;
    (authService as any).platformId = 'browser';
    (authService as any).userSubject = {
      value: null,
      next: vi.fn(function (val) {
        (authService as any).userSubject.value = val;
      }),
      asObservable: vi.fn(),
    };
  });

  it('should instantly register demo user without calling API when email is demo@linkly.com', async () => {
    const response = await authService.register({
      workspaceName: 'My Demo Space',
      email: 'demo@linkly.com',
      password: 'demo123456',
    });

    expect(mockApi.register).not.toHaveBeenCalled();
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.email).toBe('demo@linkly.com');
    expect(authService.getCurrentUser()?.workspaceName).toBe('My Demo Space');
    expect(response.accessToken).toBe('demo-jwt-token-linkly-preview');
  });

  it('should fallback to demo registration if API registration fails for a demo email', async () => {
    (mockApi.register as any).mockReturnValue(throwError(() => new Error('API down')));

    const response = await authService.register({
      workspaceName: 'Custom Demo',
      email: 'my-demo@linkly.com',
      password: 'demo123456',
    });

    expect(mockApi.register).toHaveBeenCalled();
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.email).toBe('demo@linkly.com');
    expect(authService.getCurrentUser()?.workspaceName).toBe('Custom Demo');
    expect(response.accessToken).toBe('demo-jwt-token-linkly-preview');
  });

  it('should login with demo user instantly on demo credentials', () => {
    authService.loginWithDemoUser('Custom Workspace');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getCurrentUser()?.workspaceName).toBe('Custom Workspace');
  });
});
