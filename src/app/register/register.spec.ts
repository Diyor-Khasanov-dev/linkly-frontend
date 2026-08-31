import '@angular/compiler';
import { signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { Register } from './register';

describe('Register Component Unit Tests', () => {
  it('navigates to /otp-verification with email parameter on successful standard registration', async () => {
    const mockAuthService = {
      register: vi.fn().mockResolvedValue({ message: 'User registered successfully' }),
      isAuthenticated: vi.fn().mockReturnValue(false),
    };
    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };
    const mockForm = {
      getRawValue: () => ({
        workspaceName: 'Acme Corp',
        email: 'acme@example.com',
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

    await component.register();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      workspaceName: 'Acme Corp',
      email: 'acme@example.com',
      password: 'password123',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/otp-verification'], {
      queryParams: { email: 'acme@example.com' },
    });
  });

  it('navigates directly to /dashboard on demo registration', async () => {
    const mockAuthService = {
      register: vi.fn().mockResolvedValue({ token: 'demo-token' }),
      isAuthenticated: vi.fn().mockReturnValue(true),
    };
    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };
    const mockForm = {
      getRawValue: () => ({
        workspaceName: 'Demo Workspace',
        email: 'demo@linkly.com',
        password: 'demo123456',
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

    await component.register();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('handles registration failure and displays error message', async () => {
    const mockAuthService = {
      register: vi.fn().mockRejectedValue(new Error('User already exists')),
    };
    const mockApi = {
      extractErrorMessage: vi.fn().mockReturnValue('User already exists'),
    };
    const mockForm = {
      getRawValue: () => ({
        workspaceName: 'Acme Corp',
        email: 'existing@example.com',
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
    component.api = mockApi;
    component.form = mockForm;
    component.isSubmitting = signal(false);
    component.errorMessage = signal('');

    await component.register();

    expect(component.errorMessage()).toBe('User already exists');
  });
});
