import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, afterEach, beforeEach } from 'vitest';

import { ApiService, LINKLY_API_BASE_URL } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('uses the documented bearer-token getme endpoint without cookie credentials', () => {
    service.getMe('access-token').subscribe((user) => {
      expect(user).toEqual({ id: 'user-1', email: 'user@example.com' });
    });

    const request = httpMock.expectOne(`${LINKLY_API_BASE_URL}/api/auth/getme`);

    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBe(false);
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');

    request.flush({ user: { id: 'user-1', email: 'user@example.com' } });
  });

  it('posts login requests without cookie credentials so wildcard CORS can pass', () => {
    service.login({ email: 'user@example.com', password: 'secret123' }).subscribe((response) => {
      expect(response.token).toBe('access-token');
    });

    const request = httpMock.expectOne(`${LINKLY_API_BASE_URL}/api/auth/login`);

    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(false);
    expect(request.request.body).toEqual({ email: 'user@example.com', password: 'secret123' });

    request.flush({ token: 'access-token' });
  });
});
