import '@angular/compiler';
import { signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { Login } from './login';

describe('Login Component Unit Tests', () => {
  it('pre-fills email and notice message from query parameters snapshot', () => {
    const component = Object.create(Login.prototype) as any;
    component.route = {
      snapshot: {
        queryParamMap: {
          get: (key: string) => {
            if (key === 'email') return 'verified@example.com';
            if (key === 'verified') return 'true';
            return null;
          },
        },
      },
    };
    component.form = {
      patchValue: vi.fn(),
    };
    component.noticeMessage = signal('');

    component.ngOnInit();

    expect(component.form.patchValue).toHaveBeenCalledWith({ email: 'verified@example.com' });
    expect(component.noticeMessage()).toBe('Email verified successfully! Please log in to continue.');
  });

  it('handles successful login flow and navigates to returnUrl or dashboard', async () => {
    const mockAuthService = {
      login: vi.fn().mockResolvedValue(undefined),
    };
    const mockRouter = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };
    const mockRoute = {
      snapshot: {
        queryParamMap: {
          get: (key: string) => (key === 'returnUrl' ? '/dashboard' : null),
        },
      },
    };
    const mockForm = {
      controls: {
        email: { value: 'user@example.com' },
        password: { value: 'password123' },
      },
      patchValue: vi.fn(),
      invalid: false,
      markAllAsTouched: vi.fn(),
    };

    const component = Object.create(Login.prototype) as any;
    component.authService = mockAuthService;
    component.router = mockRouter;
    component.route = mockRoute;
    component.form = mockForm;
    component.isSubmitting = signal(false);
    component.errorMessage = signal('');

    await component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
