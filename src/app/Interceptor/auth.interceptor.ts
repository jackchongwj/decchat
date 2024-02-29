import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/Auth/auth.service';
import { TokenService } from '../Services/Token/token.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService!: AuthService;
  private tokenService!: TokenService;

  private isRefreshing = new BehaviorSubject<boolean>(false);

  constructor(
    private injector: Injector,
    private _msgBox: NzMessageService) {}

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

    const accessToken = this.tokenService.getToken();
    if (accessToken) {
      request = this.addAuthorizationHeader(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing.value) {
          return this.handle401Error(request, next);
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

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing.next(true);
    return this.tokenService.renewToken().pipe(
      switchMap(token => {
        this.isRefreshing.next(false);
        if (token) {
          return next.handle(this.addAuthorizationHeader(request, token));
        }
        this.authService.logout();
        return throwError(new Error('Failed to renew token'));
      }),
      catchError((error) => {
        this.isRefreshing.next(false);
        this.authService.logout();
        return throwError(error);
      }),
      filter(() => this.isRefreshing.value === false),
      take(1)
    );
  }

  private handleReturnTooManyRequests()
  {
    this._msgBox.error("You've made too many requests in a short period. Please wait a moment and try again later.");
  }
}
