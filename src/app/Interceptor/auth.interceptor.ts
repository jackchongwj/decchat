import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../Services/Auth/auth.service';
import { TokenService } from '../Services/Token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private tokenService: TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Directly bypass auth routes without attaching a token
    if (this.shouldBypass(request.url)) {
      return next.handle(request);
    }

    // Attach token for non-bypassed routes
    const accessToken = this.tokenService.getToken();
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        // Handle 401 Unauthorized error by attempting token refresh
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        // Propagate other errors
        return throwError(() => error);
      })
    );
  }

  private shouldBypass(url: string): boolean {
    // Define URLs for the auth and token refresh endpoints
    const bypassRoutes = ['/api/Auth/login', '/api/Auth/register'];
    return bypassRoutes.some(route => url.endsWith(route));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tokenService.renewToken().pipe(
      switchMap((token: any) => {
        // Save the new token and retry the original request with the new token
        this.tokenService.setToken(token.accessToken);
        return next.handle(request.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }));
      }),
      catchError((refreshError) => {
        // Handle token refresh error, e.g., by logging out the user
        this.authService.logout();
        return throwError(() => refreshError);
      })
    );
  }
}