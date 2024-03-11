import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private UserUrl: string = environment.apiBaseUrl + 'Users/'
  constructor(private http: HttpClient) { }

  getSearch(searchValue: string): Observable<any> {
    const params = new HttpParams().set('profileName', searchValue)
    return this.http.get(`${this.UserUrl}Search`, {params, withCredentials: true})
  }

  getFriendRequest(): Observable<any>
  {
    return this.http.get(`${this.UserUrl}FriendRequest`, {withCredentials: true})
  }

  getUserById(): Observable<any> {
    return this.http.get(`${this.UserUrl}UserDetails`, {withCredentials: true});
  }

  updateProfileName(newProfileName: string): Observable<any> {
    const params = { newProfileName }; // Create a body object directly
    return this.http.post(`${this.UserUrl}UpdateProfileName`, params, { withCredentials: true });
  }
  
  updateProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const params = { formData };
    return this.http.post<any>(`${this.UserUrl}UpdateProfilePicture`, formData, { withCredentials: true });
  }
  
  deleteUser(): Observable<any> {
    return this.http.post(`${this.UserUrl}UserDeletion`, {} , { withCredentials: true });
  }

}
