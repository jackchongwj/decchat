import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {
  private url: string = environment.apiBaseUrl + 'Users/'

  constructor(private http: HttpClient) { }

  getSearch(searchValue: string): Observable<any> {
    return this.http.get(`${this.url}Search`, {params: {profileName: searchValue}})
    // .pipe(
    //   catchError((error) =>{
    //     console.error('Error in API request:', error);
    //     return throwError(error);
    //   })
    // );
  }
}
