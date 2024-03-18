import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/Auth/auth.service';
import { TokenService } from '../Services/Token/token.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService!: AuthService;
  private tokenService!: TokenService;

  private isRefreshing = new BehaviorSubject<boolean>(false);

  constructor(
    private injector: Injector,
    private message: NzMessageService,
    private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    if (!this.tokenService) {
      this.tokenService = this.injector.get(TokenService);
    }

    if (this.shouldBypass(request.url)) {
      return next.handle(request);
    }

    // Attach access token to Authorization header
    const accessToken = this.tokenService.getAccessToken();
    if (accessToken) {
      request = this.addAuthorizationHeader(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError(error => {
        // Handle invalid authorization
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing.value) {
          return this.handle401Error(request, next);
        // Handle rate limiting
        } else if (error.status === 429){
          this.handleReturnTooManyRequests();
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private shouldBypass(url: string): boolean {
    const bypassRoutes = ['/api/Auth/login', '/api/Auth/register'];
    return bypassRoutes.some(route => url.endsWith(route));
  }

  // Send refresh token to server to try renew the access token
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing.next(true);
    return this.tokenService.renewToken().pipe(
      switchMap(token => {
        this.isRefreshing.next(false);
        if (token) {
          // Token renewed successfully, proceed with the request using the new token.
          return next.handle(this.addAuthorizationHeader(request, token));
        } else {
          // Token renewal failed, logout and redirect to login.
          this.logoutAndRedirect('Failed to renew token. Please log in again.');
          throw new Error('Authentication token could not be renewed.');
        }
      }),
      catchError((error) => {
        // Error occurred during token renewal or request reattempt, logout and redirect.
        console.error('Error during token renewal or request reattempt:', error);
        this.logoutAndRedirect('Authentication invalid or expired. Please log in again.');
        return throwError(() => new Error('Error during authentication process.'));
      }),
      filter(() => this.isRefreshing.value === false),
      take(1)
    );
  }

  private handleReturnTooManyRequests()
  {
    this.message.error("You've made too many requests in a short period. Please wait a moment and try again later.");
  }

  private logoutAndRedirect(errorMessage: string) {
    this.authService.logout().subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
        this.message.error(errorMessage);
      },
      error: (e) => {
        console.error('Logout failed:', e.error);
        this.message.error('An error occured during logout. Please log in again.');
        this.router.navigate(['/login']);
      }
    });
  }
}
