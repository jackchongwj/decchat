import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { TokenService } from '../Token/token.service';
import { Router } from '@angular/router';
import { SignalRService } from '../SignalRService/signal-r.service';
import { PasswordChange } from '../../Models/DTO/User/password-change';

const AuthUrl: string = environment.apiBaseUrl + 'Auth/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
    private localStorageService: LocalstorageService,
    private tokenService: TokenService,
    private signalRService: SignalRService,
    private router: Router) { }


  register(registrationData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}register`, registrationData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}login`, loginData, { withCredentials: true }).pipe(
      map(response => {
        this.tokenService.setToken(response.AccessToken);
        this.localStorageService.setItem('userId', response.UserId);
        this.isAuthenticated.next(true);
        
        return response;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${AuthUrl}logout`, {}, { withCredentials: true }).pipe(
      map(response => {
        this.localStorageService.clear();
        this.isAuthenticated.next(false);
        this.signalRService.stopConnection();
        
        return response;
      })
    );
  }

  changePassword(id: number, passwordChangeData: PasswordChange): Observable<any> {
    return this.http.post(`${AuthUrl}PasswordChange?id=${id}`, passwordChangeData)
  }

}
