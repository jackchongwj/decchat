import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalstorageService } from '../LocalStorage/local-storage.service';

const TokenUrl: string = environment.apiBaseUrl + 'Token/'

interface TokenResponse {
  AccessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient, private localStorageService: LocalstorageService) { }

  
  setToken(token: string): void {
    this.localStorageService.setItem('accessToken', token);
  }
  
  getToken(): string | null {
    return this.localStorageService.getItem('accessToken');
  }

  renewToken(): Observable<string | null> {
    return this.http.post< TokenResponse >(`${TokenUrl}RenewToken`, {}, { withCredentials: true })
      .pipe(
        map(response => {
          const newToken = response.AccessToken;
          if (newToken) {
            this.setToken(newToken);
            return newToken;
          }
          return null;
        }),
        catchError(error => {
          console.error('Error renewing token:', error);
          return throwError(() => new Error('Failed to renew token'));
        })
      );
  }
  
}
