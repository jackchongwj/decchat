import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const UserUrl: string = environment.apiBaseUrl + 'Users/'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getSearch(searchValue: string): Observable<any> {
    return this.http.get(`${UserUrl}Search`, {params: {profileName: searchValue}})
    // .pipe(
    //   catchError((error) =>{
    //     console.error('Error in API request:', error);
    //     return throwError(error);
    //   })
    // );
  }
}
