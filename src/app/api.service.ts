import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

export const LINKLY_API_BASE_URL = 'https://linkly-backend-8vcp.onrender.com';

export interface LinklyUser {
  id?: string;
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: LinklyUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: LinklyUser;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpVerificationPayload {
  email: string;
  otp: string;
}

export interface ShortLink {
  id?: string;
  _id?: string;
  shortCode?: string;
  shortUrl?: string;
  url?: string;
  originalUrl?: string;
  longUrl?: string;
  destination?: string;
  slug?: string;
  [key: string]: unknown;
}

export interface ShortLinkResponse extends ShortLink {
  data?: ShortLink & {
    link?: ShortLink;
  };
  link?: ShortLink;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/register', payload);
  }

  verifyOtp(payload: OtpVerificationPayload): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/otp-verification', payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/auth/login', payload);
  }

  logout(token: string | null): Observable<unknown> {
    return this.post('/api/auth/logout', {}, token);
  }

  getMe(token: string | null = null): Observable<LinklyUser | null> {
    return this.get<AuthResponse | LinklyUser>('/api/auth/me', token).pipe(
      map((response) => this.extractUser(response)),
    );
  }

  createShortLink(originalUrl: string, token: string | null): Observable<ShortLinkResponse> {
    return this.post<ShortLinkResponse>('/api/links', { originalUrl }, token);
  }

  formatShortUrl(response: ShortLinkResponse): string {
    const data = response.data?.link ?? response.data ?? response.link ?? response;
    const directUrl = data.shortUrl ?? data.url;

    if (directUrl) {
      return directUrl;
    }

    const slug = data.slug ?? data.shortCode;
    return slug ? `${LINKLY_API_BASE_URL}/${slug}` : '';
  }

  extractToken(response: AuthResponse): string | null {
    return (
      response.token ??
      response.accessToken ??
      response.data?.token ??
      response.data?.accessToken ??
      null
    );
  }

  extractUser(response: AuthResponse | LinklyUser): LinklyUser | null {
    const authResponse = response as AuthResponse;

    if (authResponse.user) {
      return authResponse.user;
    }

    if (authResponse.data?.user) {
      return authResponse.data.user;
    }

    if ('email' in response || 'name' in response || 'username' in response) {
      return response as LinklyUser;
    }

    return null;
  }

  extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Unable to reach the Linkly API. Please check your connection and try again.';
      }

      const body = error.error as { message?: string; error?: string } | string | null;

      if (typeof body === 'string' && body.trim()) {
        return body;
      }

      if (body && typeof body === 'object') {
        return body.message ?? body.error ?? 'Request failed. Please try again.';
      }

      return 'Request failed. Please try again.';
    }

    return 'Request failed. Please try again.';
  }

  private get<T>(path: string, token?: string | null): Observable<T> {
    return this.http
      .get<T>(`${LINKLY_API_BASE_URL}${path}`, {
        headers: this.headers(token),
        withCredentials: true,
      })
      .pipe(catchError((error: unknown) => throwError(() => error)));
  }

  private post<T>(path: string, body: unknown, token?: string | null): Observable<T> {
    return this.http
      .post<T>(`${LINKLY_API_BASE_URL}${path}`, body, {
        headers: this.headers(token),
        withCredentials: true,
      })
      .pipe(catchError((error: unknown) => throwError(() => error)));
  }

  private headers(token?: string | null): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
