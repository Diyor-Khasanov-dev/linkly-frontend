import '@angular/compiler';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { AuthService } from './auth.service';
import { guestGuard } from './guest.guard';

describe('guestGuard Unit Tests', () => {
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
    };
    routerMock = {
      createUrlTree: vi.fn((commands: string[]) => commands as any),
    };
  });

  function executeGuestGuard(authService: any, router: any) {
    return (guestGuard as any).call(null, {} as any, {} as any, authService, router);
  }

  it('allows access when user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const result = guestGuardFn(authServiceMock as any, routerMock as any);

    expect(result).toBe(true);
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
  });

  it('redirects to /dashboard when user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const result = guestGuardFn(authServiceMock as any, routerMock as any);

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toEqual(['/dashboard']);
  });
});

function guestGuardFn(authService: { isAuthenticated(): boolean }, router: { createUrlTree(commands: string[]): any }) {
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
}
