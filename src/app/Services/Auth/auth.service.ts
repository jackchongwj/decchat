import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { PasswordChange } from '../../Models/DTO/User/password-change';

const AuthUrl: string = environment.apiBaseUrl + 'Auth/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService, private localStorageService: LocalstorageService) { }

  register(registrationData: any): Observable<any> {
    return this.http.post<any>(`${AuthUrl}register`, registrationData);
  }

  login(loginData: any): Observable<any> {
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
}
