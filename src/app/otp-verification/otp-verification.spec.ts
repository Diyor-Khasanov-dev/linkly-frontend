import '@angular/compiler';
import { signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { OtpVerification } from './otp-verification';

describe('OtpVerification Component Unit Tests', () => {
  it('initializes form and populates email from query parameter snapshot', () => {
    const component = Object.create(OtpVerification.prototype) as any;
    component.route = {
      snapshot: {
        queryParamMap: {
          get: (key: string) => (key === 'email' ? 'test@example.com' : null),
        },
      },
    };
    component.form = {
      patchValue: vi.fn(),
    };

    component.ngOnInit();

    expect(component.form.patchValue).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('handles successful verifyOtp flow when authenticated', async () => {
    const mockAuthService = {
      verifyOtp: vi.fn().mockResolvedValue({ token: 'jwt-xyz' }),
      isAuthenticated: vi.fn().mockReturnValue(true),
    };
    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };
    const mockForm = {
      getRawValue: () => ({ email: 'user@test.com', code: '123456' }),
      patchValue: vi.fn(),
      controls: {
        email: { invalid: false, markAsTouched: vi.fn() },
        code: { invalid: false, markAsTouched: vi.fn() },
      },
    };

    const component = Object.create(OtpVerification.prototype) as any;
    component.authService = mockAuthService;
    component.router = mockRouter;
    component.form = mockForm;
    component.isSubmitting = signal(false);
    component.errorMessage = signal('');

    await component.verifyOtp();

    expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('user@test.com', '123456');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('navigates to /login?email=...&verified=true when verifyOtp succeeds but no session is active', async () => {
    const mockAuthService = {
      verifyOtp: vi.fn().mockResolvedValue({ message: 'Email verified successfully.' }),
      isAuthenticated: vi.fn().mockReturnValue(false),
    };
    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };
    const mockForm = {
      getRawValue: () => ({ email: 'user@test.com', code: '123456' }),
      patchValue: vi.fn(),
      controls: {
        email: { invalid: false, markAsTouched: vi.fn() },
        code: { invalid: false, markAsTouched: vi.fn() },
      },
    };

    const component = Object.create(OtpVerification.prototype) as any;
    component.authService = mockAuthService;
    component.router = mockRouter;
    component.form = mockForm;
    component.isSubmitting = signal(false);
    component.errorMessage = signal('');

    await component.verifyOtp();

    expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('user@test.com', '123456');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { email: 'user@test.com', verified: 'true' },
    });
  });

  it('handles failed verifyOtp flow with error message', async () => {
    const mockAuthService = {
      verifyOtp: vi.fn().mockRejectedValue(new Error('Invalid code')),
    };
    const mockApi = {
      extractErrorMessage: vi.fn().mockReturnValue('Invalid code'),
    };
    const mockForm = {
      getRawValue: () => ({ email: 'user@test.com', code: '000000' }),
      patchValue: vi.fn(),
      controls: {
        email: { invalid: false, markAsTouched: vi.fn() },
        code: { invalid: false, markAsTouched: vi.fn() },
      },
    };

    const component = Object.create(OtpVerification.prototype) as any;
    component.authService = mockAuthService;
    component.api = mockApi;
    component.form = mockForm;
    component.isSubmitting = signal(false);
    component.errorMessage = signal('');

    await component.verifyOtp();

    expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('user@test.com', '000000');
    expect(component.errorMessage()).toBe('Invalid code');
  });
});
