import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
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

  renewToken(): Observable<any> {
    return this.http.get<any>(`${TokenUrl}RenewToken`, { withCredentials: true });
  }
  
}
