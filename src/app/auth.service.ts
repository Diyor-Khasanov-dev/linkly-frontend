import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const AUTH_STORAGE_KEY = 'linkly.demo.authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  login(): void {
    if (this.isBrowser()) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  isAuthenticated(): boolean {
    return this.isBrowser() && localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
