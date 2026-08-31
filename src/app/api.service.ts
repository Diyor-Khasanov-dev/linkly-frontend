import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';

export const LINKLY_API_BASE_URL = 'https://linkly-backend-8vcp.onrender.com';
const AUTH_GET_ME_PATH = '/api/auth/getme';

export interface LinklyUser {
  id?: string;
  _id?: string;
  workspaceName?: string;
  name?: string;
  username?: string;
  email?: string;
  isEmailVerified?: boolean;
  isVerificated?: boolean;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  tokenType?: string;
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
  workspaceName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpVerificationPayload {
  email: string;
  code: string;
}

export interface ShortLink {
  id?: string;
  _id?: string;
  shortCode?: string;
  shortUrl?: string;
  url?: string;
  destinationUrl?: string;
  originalUrl?: string;
  longUrl?: string;
  destination?: string;
  slug?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ShortLinkResponse extends ShortLink {
  data?: ShortLink & {
    link?: ShortLink;
  };
  link?: ShortLink;
  message?: string;
}

export interface CreateLinkPayload {
  url: string;
  customAlias?: string;
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
    return this.post('/api/auth/logout', token ? { accessToken: token } : {}, token);
  }

  getMe(token: string | null = null): Observable<LinklyUser | null> {
    return this.get<AuthResponse | LinklyUser>(AUTH_GET_ME_PATH, token).pipe(
      map((response) => this.extractUser(response)),
    );
  }

  createShortLink(
    url: string,
    token: string | null = null,
    customAlias?: string,
  ): Observable<ShortLinkResponse> {
    const payload: CreateLinkPayload = { url };
    if (customAlias && customAlias.trim()) {
      payload.customAlias = customAlias.trim();
    }
    return this.post<ShortLinkResponse>('/api/links', payload, token);
  }

  getQrCodeUrl(url: string): string {
    return `${LINKLY_API_BASE_URL}/api/qr?url=${encodeURIComponent(url)}`;
  }

  getShortLinkQrCodeUrl(shortCode: string): string {
    return `${LINKLY_API_BASE_URL}/api/links/${encodeURIComponent(shortCode)}/qrcode`;
  }

  formatShortUrl(response: ShortLinkResponse): string {
    const data = response.data?.link ?? response.data ?? response.link ?? response;
    const directUrl = data.shortUrl ?? data.url;

    if (directUrl) {
      return directUrl;
    }

    const slug = data.shortCode ?? data.slug;
    return slug ? `${LINKLY_API_BASE_URL}/${slug}` : '';
  }

  extractToken(response: AuthResponse): string | null {
    return (
      response.accessToken ??
      response.token ??
      response.data?.accessToken ??
      response.data?.token ??
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

    if ('email' in response || 'workspaceName' in response || 'name' in response || 'username' in response) {
      return response as LinklyUser;
    }

    return null;
  }

  extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'The browser could not complete the Linkly API request. This is usually caused by CORS, a blocked preflight request, or a mixed-content/network policy—not by your internet connection.';
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
      })
      .pipe(
        timeout(10000),
        catchError((error: unknown) => throwError(() => error)),
      );
  }

  private post<T>(path: string, body: unknown, token?: string | null): Observable<T> {
    return this.http
      .post<T>(`${LINKLY_API_BASE_URL}${path}`, body, {
        headers: this.headers(token),
      })
      .pipe(
        timeout(10000),
        catchError((error: unknown) => throwError(() => error)),
      );
  }

  private headers(token?: string | null): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
