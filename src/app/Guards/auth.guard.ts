import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TokenService } from '../Services/Token/token.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../Services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _authService?: AuthService;

  constructor(
    private router: Router, 
    private injector: Injector,
    private message: NzMessageService,
  ) {}

  private get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$().pipe(
      switchMap(isAuthenticated => {
        const isLoginPage = state.url.includes('/login') || state.url === '/';
        if (!isAuthenticated && !isLoginPage) {
          // Not authenticated and trying to access a protected route
          this.message.error('Authentication expired. Please log in again.');
          return from(this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })).pipe(map(() => false));
        } else if (isAuthenticated && isLoginPage) {
          // Authenticated and trying to access the login page
          this.message.info('Authentication detected. Redirecting to dashboard.');
          return from(this.router.navigate(['/dashboard'])).pipe(map(() => false));
        } else {
          // Authenticated and accessing a protected route
          // OR not authenticated and accessing the login page
          return of(true);
        }
      })
    );
  }
}
