import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, throwError, from } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TokenService } from '../Token/token.service';
import { SignalRService } from '../SignalRService/signal-r.service';
import { PasswordChange } from '../../Models/DTO/User/password-change';

const AuthUrl: string = environment.apiBaseUrl + 'Auth/'

interface AuthCache {
  timestamp: number;
  state: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Caching the authentication state
  private isAuthenticatedCache = new BehaviorSubject<AuthCache | null>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private signalRService: SignalRService,
    private jwtHelper: JwtHelperService) { }


  register(registrationData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}register`, registrationData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}login`, loginData, { withCredentials: true }).pipe(
      map(response => {
        this.tokenService.setTokens(response.AccessToken, response.RefreshToken);
        this.isAuthenticatedCache.next({ timestamp: Date.now(), state: true });
        return response;
      })
    );
  }

  logout(): Observable<any> {
    return from(this.signalRService.stopConnection()).pipe(
      switchMap(() => {
        const refreshToken = this.tokenService.getRefreshToken() || '';
        const headers = { 'X-Refresh-Token': refreshToken };
        return this.http.post<any>(`${AuthUrl}logout`, {}, { headers, withCredentials: true });
      }),
      map(response => {
        this.tokenService.clearTokens();
        this.isAuthenticatedCache.next({ timestamp: Date.now(), state: false });
        return response;
      })
    );
  }

  changePassword(passwordChangeData: PasswordChange): Observable<any> {
    return this.http.post(`${AuthUrl}PasswordChange`, passwordChangeData, { withCredentials: true })
  }

  isAuthenticated$(): Observable<boolean> {
    // Check cache for authentication state and set it for 15 mins
    const cache = this.isAuthenticatedCache.value;
    const now = Date.now();

    if (cache && (now - cache.timestamp) < 15 * 60 * 1000) {
      return of(cache.state);
    }

    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.isAuthenticatedCache.next({ timestamp: now, state: false });
      return of(false);
    }

    if (!accessToken || this.jwtHelper.isTokenExpired(accessToken)) {
      return this.tokenService.renewToken().pipe(
        map(newToken => {
          const isAuthenticated = !!newToken;
          this.isAuthenticatedCache.next({ timestamp: Date.now(), state: isAuthenticated });
          return isAuthenticated;
        }),
        catchError(() => {
          this.isAuthenticatedCache.next({ timestamp: Date.now(), state: false });
          return of(false);
        })
      );
    } else {
      this.isAuthenticatedCache.next({ timestamp: now, state: true });
      return of(true);
    }
  }
}
