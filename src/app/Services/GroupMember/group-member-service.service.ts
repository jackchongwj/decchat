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

  getGroupMembers(chatRoomId: number): Observable<any> {
    const params = new HttpParams().set('chatRoomID', chatRoomId.toString()).set('timestamp',new Date().toString());
    return this.http.get(`${this.url}groupMembers`, { params: params, withCredentials: true });
  }

  removeUser(chatRoomId: number, removedUserId: number, InitiatedBy: number): Observable<any> {
    const params = new HttpParams()
      .set('chatRoomID', chatRoomId.toString())
      .set('removedUserId', removedUserId.toString())
      .set('InitiatedBy', InitiatedBy.toString());
    return this.http.post<number>(`${this.url}RemoveFromGroup`, null, { params , withCredentials : true });
  }

  quitGroup(chatRoomId: number): Observable<any> {
    const params = new HttpParams()
      .set('chatRoomID', chatRoomId.toString())
  
    return this.http.post<number>(`${this.url}QuitGroup`, null, { params , withCredentials : true });
  }
}

