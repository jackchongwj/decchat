import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../Services/Auth/auth.service';
import { TokenService } from '../Services/Token/token.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        TokenService,
        AuthService,
        NzMessageService
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no requests are outstanding.
  });

  it('should add an Authorization header', () => {
    spyOn(tokenService, 'getAccessToken').and.returnValue('fake-token');

    // Perform a HTTP request
    http.get('/api/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('/api/test');

    // Check for the Authorization header
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer fake-token');

    httpRequest.flush({ data: 'test' }); // Mock a response
  });

  it('should handle 401 unauthorized error by attempting token renewal', (done) => {
    spyOn(tokenService, 'getAccessToken').and.returnValue('expired-token');
    spyOn(tokenService, 'renewToken').and.returnValue(throwError(() => new Error('Authentication token could not be renewed.')));

    http.get('/api/secure').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: error => {
        expect(error.message).toContain('Authentication token could not be renewed.');
        done();
      }
    });

    const httpRequest = httpMock.expectOne('/api/secure');
    httpRequest.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  // Additional tests can be added here to cover other scenarios like successful token renewal, rate limiting, etc.
});
