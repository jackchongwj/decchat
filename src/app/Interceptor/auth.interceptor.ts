import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/Auth/auth.service';
import { TokenService } from '../Services/Token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private tokenService: TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Define a list of routes that should not have the Authorization header
    const authRoutes = ['/api/auth/login', '/api/auth/register'];

    // Check if the request is to an auth route
    const isAuthRoute = authRoutes.some(route => request.url.includes(route));

    // If not an auth route, and we have an access token, clone the request to include the Authorization header
    if (!isAuthRoute) {
      const accessToken = this.tokenService.getToken();
      if (accessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error) => {

        if (error.status === 401) {

          return this.handle401Error(request, next);
        }

        return throwError(() => new Error('An unexpected error occurred'));
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Example token refresh logic
    return this.tokenService.renewToken().pipe(
      switchMap((newToken: string) => {
        // Save the new token
        this.tokenService.setToken(newToken);

        // Clone the request with the new token
        const updatedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });

        return next.handle(updatedRequest);
      }),
      catchError((refreshError) => {
        this.authService.logout();
        return throwError(() => new Error(refreshError));
      })
    );
  }
}
