import '@angular/compiler';
import { signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { Register } from './register';

describe('Register Component Unit Tests', () => {
  it('navigates to /otp-verification after successful registration', async () => {
    const mockAuthService = {
      register: vi.fn().mockResolvedValue({ accessToken: 'test-token' }),
    };
    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };
    const mockForm = {
      getRawValue: () => ({
        workspaceName: 'New Workspace',
        email: 'newuser@example.com',
        password: 'password123',
      }),
      patchValue: vi.fn(),
      controls: {
        workspaceName: { invalid: false, markAsTouched: vi.fn() },
        email: { invalid: false, markAsTouched: vi.fn() },
        password: { invalid: false, markAsTouched: vi.fn() },
      },
    };

    const component = Object.create(Register.prototype) as any;
    component.authService = mockAuthService;
    component.router = mockRouter;
    component.form = mockForm;
    component.isSubmitting = signal(false);
    component.errorMessage = signal('');
    component.noticeMessage = signal('');

    await component.register();

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/otp-verification'], {
      queryParams: { email: 'newuser@example.com' },
    });
  });
});
