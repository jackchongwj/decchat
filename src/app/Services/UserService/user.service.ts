import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected UserUrl: string = environment.apiBaseUrl + 'Users/'

  constructor(private http: HttpClient) { }

  getSearch(searchValue: string, userId: Number): Observable<any> {
    const params = new HttpParams().set('profileName', searchValue).set('userId',userId.toString());
    return this.http.get(`${this.UserUrl}Search`, {params})
  }

  getFriendRequest(userId: Number): Observable<any>
  {
    const params = new HttpParams().set('userId',userId.toString());
    return this.http.get(`${this.UserUrl}FriendRequest`, {params})
  }

  doesUsernameExist(username: string): Observable<boolean> {
    return this.http.get<any>(`${this.UserUrl}DoesUsernameExist?username=${encodeURIComponent(username)}`)
        .pipe(
            map(response => response === true)
        );
  }

  getUserById(id: number): Observable<any> {
    const params = new HttpParams().set('id',id.toString());
    return this.http.get(`${this.UserUrl}UserDetails`, {params});
  }

  updateProfileName(id: number, newProfileName: string): Observable<any> {
    const params = { id, newProfileName }; // Create a body object directly
    return this.http.post(`${this.UserUrl}UpdateProfileName`, params);
  }
  
  updateProfilePicture(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id', userId.toString());
    const params = { formData };
    return this.http.post<any>(`${this.UserUrl}UpdateProfilePicture`, formData);
  }
  
  deleteUser(id: number): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.post(`${this.UserUrl}UserDeletion?id=${id}`, {} );
  }

  
  
}
