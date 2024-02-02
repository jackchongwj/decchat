import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/Auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getToken();

    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {

        if (error.status === 401) {

          return this.handle401Error(request, next);
        }

        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Example token refresh logic
    return this.authService.renewToken().pipe(
      switchMap((newToken: string) => {
        // Save the new token
        this.authService.setToken(newToken);

        // Clone the request with the new token
        const updatedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });

        return next.handle(updatedRequest);
      }),
      catchError((refreshError) => {
        // If refreshing also fails, handle it (e.g., logout the user)
        this.authService.logout();
        return throwError(refreshError);
      })
    );
  }
}
