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
        return response;
      })
    );
  }

  changePassword(passwordChangeData: PasswordChange): Observable<any> {
    return this.http.post(`${AuthUrl}PasswordChange`, passwordChangeData, { withCredentials: true })
  }

  isAuthenticated$(): Observable<boolean> {
    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return of(false);
    }

    // First validate the refresh token
    return this.tokenService.validateRefreshToken().pipe(
      switchMap(isRefreshTokenValid => {
        if (!isRefreshTokenValid) {
          // If refresh token is not valid, there's no need to check the access token
          return of(false);
        } else if (!accessToken || this.jwtHelper.isTokenExpired(accessToken)) {
          // If access token is missing or expired, attempt to renew it
          return this.tokenService.renewToken().pipe(
            map(newToken => !!newToken),
            catchError(() => of(false))
          );
        } else {
          // If refresh token is valid and access token is not expired, authentication is confirmed
          return of(true);
        }
      }),
      catchError(() => of(false)) // Handle any errors in the entire process
    );
  }
}
