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
    return this.http.post<any>(`${AuthUrl}login`, loginData);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${AuthUrl}logout`, {});
  }

  setUserId(userId: string): void {
    console.log("userId: " + userId);
    this.localStorageService.setItem('userId', userId);
  }
}
