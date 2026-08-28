import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

import { ApiService, AuthResponse, LinklyUser, LoginPayload, RegisterPayload } from './api.service';

const AUTH_STORAGE_KEY = 'linkly.auth.token';
const USER_STORAGE_KEY = 'linkly.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  private readonly userSubject = new BehaviorSubject<LinklyUser | null>(this.getStoredUser());

  readonly user$: Observable<LinklyUser | null> = this.userSubject.asObservable();

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await firstValueFrom(this.api.register(payload));
    this.persistAuthResponse(response);
    return response;
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const response = await firstValueFrom(this.api.verifyOtp({ email, otp }));
    this.persistAuthResponse(response);
    return response;
  }

  async login(payload: LoginPayload): Promise<void> {
    const response = await firstValueFrom(this.api.login(payload));
    this.persistAuthResponse(response);
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    this.clearSession();

    if (token) {
      await firstValueFrom(this.api.logout(token)).catch(() => undefined);
    }
  }

  async refreshUser(): Promise<LinklyUser | null> {
    const token = this.getToken();

    if (!token) {
      this.clearSession();
      return null;
    }

    const user = await firstValueFrom(this.api.getMe(token));
    this.setUser(user);
    return user;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
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

    if (token && this.isBrowser()) {
      localStorage.setItem(AUTH_STORAGE_KEY, token);
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
    }
  }

  private clearSession(): void {
    this.userSubject.next(null);

    if (this.isBrowser()) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
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
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
