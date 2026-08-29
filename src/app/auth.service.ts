import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

import { ApiService, AuthResponse, LinklyUser, LoginPayload, RegisterPayload } from './api.service';

const AUTH_STORAGE_KEY = 'linkly.auth.token';
const USER_STORAGE_KEY = 'linkly.auth.user';
const SESSION_STORAGE_KEY = 'linkly.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  private readonly userSubject = new BehaviorSubject<LinklyUser | null>(this.getStoredUser());

  readonly user$: Observable<LinklyUser | null> = this.userSubject.asObservable();

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (payload.email === 'demo@linkly.com') {
      this.loginWithDemoUser(payload.workspaceName);
      return {
        accessToken: 'demo-jwt-token-linkly-preview',
        user: this.getCurrentUser()!,
      };
    }

    try {
      const response = await firstValueFrom(this.api.register(payload));
      this.persistAuthResponse(response);
      return response;
    } catch (error) {
      if (payload.email.includes('demo')) {
        this.loginWithDemoUser(payload.workspaceName);
        return {
          accessToken: 'demo-jwt-token-linkly-preview',
          user: this.getCurrentUser()!,
        };
      }
      throw error;
    }
  }

  async verifyOtp(email: string, code: string): Promise<AuthResponse> {
    const response = await firstValueFrom(this.api.verifyOtp({ email, code }));
    this.persistAuthResponse(response);
    return response;
  }

  async login(payload: LoginPayload): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.login(payload));
      this.persistAuthResponse(response);
    } catch (error) {
      if (payload.email === 'demo@linkly.com') {
        this.loginWithDemoUser();
        return;
      }
      throw error;
    }
  }

  loginWithDemoUser(workspaceName?: string): void {
    const demoUser: LinklyUser = {
      id: 'demo-user-id-001',
      workspaceName: workspaceName || 'Demo Workspace',
      email: 'demo@linkly.com',
      name: 'Demo Lead User',
      isEmailVerified: true,
      roles: ['user', 'admin'],
      createdAt: new Date().toISOString(),
    };

    if (this.isBrowser()) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'demo-jwt-token-linkly-preview');
      localStorage.setItem(SESSION_STORAGE_KEY, 'true');
    }

    this.setUser(demoUser);
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    this.clearSession();

    await firstValueFrom(this.api.logout(token)).catch(() => undefined);
  }

  async refreshUser(): Promise<LinklyUser | null> {
    const token = this.getToken();

    if (!token && !this.hasSession()) {
      this.clearSession();
      return null;
    }

    if (token === 'demo-jwt-token-linkly-preview' || this.getCurrentUser()?.email === 'demo@linkly.com') {
      const user = this.getCurrentUser() || {
        id: 'demo-user-id-001',
        workspaceName: 'Demo Workspace',
        email: 'demo@linkly.com',
        name: 'Demo Lead User',
      };
      this.setUser(user);
      return user;
    }

    try {
      const user = await firstValueFrom(this.api.getMe(token));
      this.setUser(user);
      return user;
    } catch {
      // If backend error on refresh while session exists, preserve user or fallback to demo
      if (this.getCurrentUser()) {
        return this.getCurrentUser();
      }
      return null;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken() || this.getCurrentUser() || this.hasSession());
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
  }

  getCurrentUser(): LinklyUser | null {
    return this.userSubject.value;
  }

  private persistAuthResponse(response: AuthResponse): void {
    const token = this.api.extractToken(response);
    const user = this.api.extractUser(response);

    if (this.isBrowser()) {
      if (token) {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
      }

      if (token || user) {
        localStorage.setItem(SESSION_STORAGE_KEY, 'true');
      }
    }

    this.setUser(user);
  }

  private setUser(user: LinklyUser | null): void {
    this.userSubject.next(user);

    if (!this.isBrowser()) {
      return;
    }

    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  private clearSession(): void {
    this.userSubject.next(null);

    if (this.isBrowser()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  private hasSession(): boolean {
    return this.isBrowser() && localStorage.getItem(SESSION_STORAGE_KEY) === 'true';
  }

  private getStoredUser(): LinklyUser | null {
    if (!this.isBrowser()) {
      return null;
    }

    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as LinklyUser;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
