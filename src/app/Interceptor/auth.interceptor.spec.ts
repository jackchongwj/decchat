import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../Services/Auth/auth.service';
import { TokenService } from '../Services/Token/token.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getAccessToken', 'renewToken']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        JwtHelperService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header', () => {
    tokenServiceSpy.getAccessToken.and.returnValue('fake-token');

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

  it('should handle 401 unauthorized error by successfully renewing token and retrying the request', (done) => {
    tokenServiceSpy.getAccessToken.and.returnValue('expired-token'); // Initial token
    tokenServiceSpy.renewToken.and.returnValue(of('new-token')); // New token on renewal
  
    http.get('/api/secure').subscribe(response => {
      expect(response).toBeTruthy();
      // Additional assertions as needed
      done();
    });
  
    const failedReq = httpMock.expectOne('/api/secure');
    failedReq.flush(null, { status: 401, statusText: 'Unauthorized' }); // Simulate 401 response
  
    const retryReq = httpMock.expectOne('/api/secure');
    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token'); // Ensure the new token is used
    retryReq.flush({ data: 'success' }); // Mock a successful response for the retried request
  });
  
  
  it('should handle 429 rate limiting error by showing a message to the user', () => {
    const messageServiceSpy = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
    spyOn(messageServiceSpy, 'error');
  
    http.get('/api/rate-limited-endpoint').subscribe({
      error: (error) => {
        expect(error.status).toBe(429);
        expect(messageServiceSpy.error).toHaveBeenCalledWith("You've made too many requests in a short period. Please wait a moment and try again later.");
      }
    });
  
    const req = httpMock.expectOne('/api/rate-limited-endpoint');
    req.flush(null, { status: 429, statusText: 'Too Many Requests' }); // Simulate 429 response
  });

  it('should bypass interceptor for specified routes like login and registration', () => {
    http.get('/api/Auth/login').subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const loginRequest = httpMock.expectOne('/api/Auth/login');
    expect(loginRequest.request.headers.has('Authorization')).toEqual(false);
  
    http.get('/api/Auth/register').subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const registerRequest = httpMock.expectOne('/api/Auth/register');
    expect(registerRequest.request.headers.has('Authorization')).toEqual(false);
  });
});
