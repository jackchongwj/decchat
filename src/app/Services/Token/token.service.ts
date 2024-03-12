import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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


  setTokens(accessToken: string, refreshToken: string): void {
    this.localStorageService.setItem('accessToken', accessToken);
    this.localStorageService.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return this.localStorageService.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return this.localStorageService.getItem('refreshToken');
  }

  clearTokens(): void {
    this.localStorageService.removeItem('accessToken');
    this.localStorageService.removeItem('refreshToken');
  }

  renewToken(): Observable<string | null> {
    const refreshToken = this.localStorageService.getItem('refreshToken');

    // Create a custom http header to pass the refresh token
    let headers = new HttpHeaders();
    if (refreshToken) {
      headers = headers.set('X-Refresh-Token', refreshToken);
    }

    return this.http.post<TokenResponse>(`${TokenUrl}RenewToken`, {}, { headers, withCredentials: true })
      .pipe(
        map(response => {
          const newToken = response.AccessToken;
          if (newToken) {
            this.localStorageService.setItem('accessToken', newToken);
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
