import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


const UserUrl: string = environment.apiBaseUrl + 'Users/'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getSearch(searchValue: string): Observable<any> {
    const params = new HttpParams().set('profileName', searchValue);
    return this.http.get(`${UserUrl}Search`, {params, withCredentials: true})
  }

  getFriendRequest(): Observable<any>
  {
    return this.http.get(`${UserUrl}FriendRequest`, { withCredentials: true})
  }

  getUserById(): Observable<any> {
    return this.http.get(`${UserUrl}UserDetails`, {withCredentials: true});
  }

  updateProfileName(newProfileName: string): Observable<any> {
    const params = { newProfileName }; // Create a body object directly
    return this.http.post(`${UserUrl}UpdateProfileName`, params, { withCredentials: true });
  }
  
  updateProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const params = { formData };
    return this.http.post<any>(`${UserUrl}UpdateProfilePicture`, formData, { withCredentials: true });
  }
  
  deleteUser(): Observable<any> {
    return this.http.post(`${UserUrl}UserDeletion`, {} , { withCredentials: true });
  }

}
