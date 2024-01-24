import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const UserUrl: string = environment.apiBaseUrl + 'Users/'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getSearch(searchValue: string, userId: Number): Observable<any> {
    const params = new HttpParams().set('profileName', searchValue).set('userId',userId.toString());
    return this.http.get(`${UserUrl}Search`, {params})
  }

  getFriendRequest(userId: Number): Observable<any>
  {
    const params = new HttpParams().set('userId',userId.toString());
    return this.http.get(`${UserUrl}FriendRequest`, {params})
  }
}
