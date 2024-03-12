import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of, from, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { TokenService } from '../Services/Token/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../Services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private tokenService: TokenService, 
    private message: NzMessageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();
    const isLoginPage = state.url.includes('/login') || state.url === '/';

    // If refresh token not available, redirect to login
    if (!refreshToken) {
      return this.handleNoToken(isLoginPage, state.url);
    }
    
    // Treat no accessToken or invalid accessToken the same way
    const tokenIsValid = accessToken && !this.jwtHelper.isTokenExpired(accessToken);
    if (!tokenIsValid) {
      // Token is invalid, expired, or missing; attempt to renew it
      return this.tokenService.renewToken().pipe(
        switchMap(newToken => {
          if (newToken) {
            // Token successfully renewed, handle accordingly
            return this.handleValidToken(isLoginPage);
          } else {
            // Token renewal failed or token unavailable, redirect as necessary
            return this.handleRedirect(isLoginPage, state.url);
          }
        }),
        catchError(() => {
          // Handle errors during token renewal, redirect as necessary
          return this.handleRedirect(isLoginPage, state.url);
        })
      );
    } else {
      // Token is valid, handle accordingly
      return this.handleValidToken(isLoginPage);
    }
  }

  private handleValidToken(isLoginPage: boolean): Observable<boolean> {
    if (isLoginPage) {
      this.message.info('Authentication detected. Redirecting to dashboard.');
      return from(this.router.navigate(['/dashboard'])).pipe(map(() => false));
    } else {
      return of(true);
    }
  }

  private handleRedirect(isLoginPage: boolean, returnUrl: string): Observable<boolean> {
    if (isLoginPage) {
      return of(true); 
    } else {
      this.message.error('Authentication expired. Please log in again.');
      return from(this.router.navigate(['/login'], { queryParams: { returnUrl } })).pipe(map(() => false));
    }
  }

  private handleNoToken(isLoginPage: boolean, returnUrl: string): Observable<boolean> {
    if (isLoginPage) {
      return of(true); 
    } else {
      return from(this.router.navigate(['/login'], { queryParams: { returnUrl } })).pipe(map(() => false));
    }
  }
}
