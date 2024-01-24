import { HttpClient ,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import internal from 'stream';
import { environment } from '../../../environments/environment.development';
import { Friend } from '../../Models/Friend/friend';
import { FriendRequest } from '../../Models/DTO/Friend/friend-request';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private url: string = environment.apiBaseUrl + 'Friends/'

  constructor(private http: HttpClient) { }

  addFriends(friends: Friend): Observable<any>
  {
    return this.http.post<Friend>(`${this.url}AddFriend`, friends)
  }

  UpdateFriendRequest(friendRequest: FriendRequest): Observable<any>
  {
    return this.http.post<FriendRequest>(`${this.url}UpdateFriendRequest`, friendRequest)
  }
}
