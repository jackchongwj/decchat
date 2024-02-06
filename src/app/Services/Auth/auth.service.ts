import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { LocalstorageService } from '../LocalStorage/local-storage.service';


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
    return this.http.post<any>(`${AuthUrl}logout`, {});
  }

  setUserId(userId: string): void {
    this.localStorageService.setItem('userId', userId);
  }

  setToken(token: string): void {
    this.localStorageService.setItem('accessToken', token);
  }
  
  getToken(): string | null {
    return this.localStorageService.getItem('accessToken');
  }

  renewToken(): Observable<string> {
    const refreshToken = this.cookieService.get('refreshToken');

    return this.http.post<any>(`${AuthUrl}renew-token`, { refreshToken })
      .pipe(
        map(response => {
          if (response && response.accessToken) {
            this.setToken(response.accessToken);
            return response.accessToken;
          } else {
            throw new Error('Failed to refresh token');
          }
        }),
        catchError(error => {
          // Handle errors such as invalid refresh token, network issues, etc.
          return throwError(error);
        })
      );

  }

  clearStorage(): void {
    this.localStorageService.clear();
  }
}
