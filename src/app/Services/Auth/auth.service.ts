import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, throwError, from } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { TokenService } from '../Token/token.service';
import { Router } from '@angular/router';
import { SignalRService } from '../SignalRService/signal-r.service';
import { PasswordChange } from '../../Models/DTO/User/password-change';
import { DataShareService } from '../ShareDate/data-share.service';

const AuthUrl: string = environment.apiBaseUrl + 'Auth/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalstorageService,
    private tokenService: TokenService,
    private signalRService: SignalRService,
    private _dsService:DataShareService) { }


  register(registrationData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}register`, registrationData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}login`, loginData, { withCredentials: true }).pipe(
      map(response => {
        this.tokenService.setTokens(response.AccessToken, response.RefreshToken);
        // this._dsService.updateUserId(response.UserId);
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

}
