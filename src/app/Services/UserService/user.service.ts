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

  getSearch(searchValue: string, userId: Number): Observable<any> {
    const params = new HttpParams().set('profileName', searchValue).set('userId',userId.toString());
    return this.http.get(`${UserUrl}Search`, {params, withCredentials: true})
  }

  getFriendRequest(userId: Number): Observable<any>
  {
    const params = new HttpParams().set('userId',userId.toString());
    return this.http.get(`${UserUrl}FriendRequest`, {params, withCredentials: true})
  }

  getUserById(id: number): Observable<any> {
    const params = new HttpParams().set('id',id.toString());
    console.log(params);
    return this.http.get(`${UserUrl}UserDetails`, {params, withCredentials: true});
  }

  updateProfileName(id: number, newProfileName: string): Observable<any> {
    const params = { id, newProfileName }; // Create a body object directly
    return this.http.post(`${UserUrl}UpdateProfileName`, params, { withCredentials: true });
  }
  
  updateProfilePicture(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id', userId.toString());
    const params = { formData };
    return this.http.post<any>(`${UserUrl}UpdateProfilePicture`, formData, { withCredentials: true });
  }
  
  deleteUser(id: number): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.post(`${UserUrl}UserDeletion?id=${id}`, {} , { withCredentials: true });
  }

  
  
}
