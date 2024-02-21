import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalstorageService } from '../LocalStorage/local-storage.service';

const TokenUrl: string = environment.apiBaseUrl + 'Token/'

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient, private localStorageService: LocalstorageService, private cookieService: CookieService) { }

  
  setToken(token: string): void {
    this.localStorageService.setItem('accessToken', token);
  }
  
  getToken(): string | null {
    return this.localStorageService.getItem('accessToken');
  }

  renewToken(): Observable<string | null> {
    return this.http.post< {AccessToken: string} >(`${TokenUrl}RenewToken`, {}, { withCredentials: true })
    .pipe(
      map(response => {
        return response.AccessToken;
      }),
      catchError(error => {
        console.error('Error renewing token:', error);
        return throwError(() => new Error('Failed to renew token'));
      })
    );
  }
  
}
