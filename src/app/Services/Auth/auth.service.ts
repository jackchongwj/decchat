import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { TokenService } from '../Token/token.service';
import { isPlatformBrowser } from '@angular/common';
import { PasswordChange } from '../../Models/DTO/User/password-change';

const AuthUrl: string = environment.apiBaseUrl + 'Auth/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper: JwtHelperService = new JwtHelperService();


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object, private localStorageService: LocalstorageService, private tokenService: TokenService) { }

  register(registrationData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}register`, registrationData);
  }

  login(loginData: any): Observable<any> {
    console.log(AuthUrl);
    return this.http.post<any>(`${AuthUrl}login`, loginData, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${AuthUrl}logout`, {}, { withCredentials: true });
  }

  setUserId(userId: string): void {
    console.log("userId: " + userId);
    this.localStorageService.setItem('userId', userId);
  }

  changePassword(id: number, passwordChangeData: PasswordChange): Observable<any> {
    return this.http.post(`${AuthUrl}PasswordChange?id=${id}`, passwordChangeData)
  }

  isLoggedIn(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false); // Immediately return false if not in browser context
    }

    const token = this.tokenService.getToken();
    if (!token) {
      return of(false); // Token not present
    }

    if (!this.jwtHelper.isTokenExpired(token)) {
      return of(true); // Token present and valid
    }

    // Token is expired, attempt to renew it
    return this.tokenService.renewToken().pipe(
      switchMap(newToken => {
        if (newToken) {
          this.tokenService.setToken(newToken); // Update the token
          return of(true);
        }
        // Token renewal failed
        return of(false);
      }),
      catchError(() => of(false)) // Handle any errors, treat as not logged in
    );
  }
}
