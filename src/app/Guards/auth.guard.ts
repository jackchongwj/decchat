import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateFn } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map, Observable } from 'rxjs';
import { AuthService } from '../Services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {
  constructor(private authService: AuthService, private router: Router, private message: NzMessageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    return this.authService.isLoggedIn().pipe(map(isLoggedIn => {
      if (!isLoggedIn) {
        // If not logged in, redirect to login page
        this.router.navigate(['/login']);
        this.message.warning('Authentication expired. Please log in again.');
        return false;
      }
      return true;
    }));
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(PermissionsService).canActivate(next, state);
}

