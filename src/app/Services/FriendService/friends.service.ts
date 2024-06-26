import { HttpClient ,HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Friend } from '../../Models/Friend/friend';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';
import { DeleteFriendRequest } from '../../Models/DTO/DeleteFriend/delete-friend-request';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private url: string = environment.apiBaseUrl + 'Friends/'

  constructor(private http: HttpClient) { }

  addFriends(friends: Friend): Observable<any>
  {
    return this.http.post<Friend>(`${this.url}AddFriend`, friends, { withCredentials: true })
  }

  UpdateFriendRequest(friendRequest: FriendRequest): Observable<any> {
    return this.http.post<number>(`${this.url}UpdateFriendRequest`, friendRequest,  { withCredentials: true });
  }

  DeleteFriend(deleteFriendRequest: DeleteFriendRequest): Observable<any> {   
    return this.http.post<number>(`${this.url}DeleteFriend`, deleteFriendRequest, { withCredentials: true });
  }
}
