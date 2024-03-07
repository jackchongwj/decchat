import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupMemberList } from '../../Models/DTO/GroupMember/group-member-list';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GroupMemberServiceService {
  private url: string = environment.apiBaseUrl + 'Chatroom/';

  constructor(private http: HttpClient) { }

  getGroupMembers(chatRoomId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('chatRoomID', chatRoomId.toString()).set('userId', userId.toString()).set('timestamp',new Date().toString());
    // const params = new HttpParams().set('chatRoomID', chatRoomId.toString()).set('userId', userId.toString());
    return this.http.get(`${this.url}groupMembers`, { params: params });
  }

  removeUser(chatRoomId: number, userId: number, InitiatedBy: number, currentUserId: number): Observable<any> {
    const params = new HttpParams()
      .set('chatRoomID', chatRoomId.toString())
      .set('userId', userId.toString())
      .set('InitiatedBy', InitiatedBy.toString())
      .set('CurrentUserId', currentUserId.toString());
    return this.http.post<number>(`${this.url}RemoveFromGroup`, null, { params });
  }

  quitGroup(chatRoomId: number, userId: number): Observable<any> {
    const params = new HttpParams()
      .set('chatRoomID', chatRoomId.toString())
      .set('userId', userId.toString())

    return this.http.post<number>(`${this.url}QuitGroup`, null, { params });
  }
}

