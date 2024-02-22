import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupMemberList } from '../../Models/DTO/GroupMember/group-member-list';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class GroupMemberServiceService {
  private url: string = environment.apiBaseUrl+ 'Chatroom/';

  constructor(private http: HttpClient) { }

  getGroupMembers(chatRoomId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('chatRoomID', chatRoomId.toString()).set('userId', userId.toString());
    console.log ("pp", params);

    return this.http.get(`${this.url}groupMembers`, {params: params});
  }

  // removeUser(groupMembers:GroupMemberList): Observable<any> {
  //   // Create data object from Group properties
  //   const data = {
  //     ChatRoomId:groupMembers.ChatRoomId ,
  //     UserId: groupMembers.UserId
  //   };
  //   return this.http.post<number>(`${this.url}RemoveFromGroup`, data); 
  // }

  removeUser(chatRoomId: number, userId: number, InitiatedBy: number): Observable<any> {
    const params = new HttpParams()
      .set('chatRoomID', chatRoomId.toString())
      .set('userId', userId.toString())
      .set('InitiatedBy', InitiatedBy.toString());
  
    return this.http.post<number>(`${this.url}RemoveFromGroup`, null, { params });
  }

  quitGroup(chatRoomId: number, userId: number): Observable<any> {
    const params = new HttpParams()
      .set('chatRoomID', chatRoomId.toString())
      .set('userId', userId.toString())
  
    return this.http.post<number>(`${this.url}QuitGroup`, null, { params });
  }
  
  // removeUser(groupMembers:GroupMemberList): Observable<any> {
  //   console.log("haaaha", groupMembers)
  //   // const params = new HttpParams().set('chatRoomId', chatRoomId.toString()).set('userId', userId.toString());
  //   return this.http.post<number>(`${this.url}RemoveFromGroup`,  { groupMembers});

    // // Create data object from Group properties
    // const data = {
    //   ChatRoomId:chatRoomId,
    //   UserId: userId
    // };
    // return this.http.post(`${this.url}RemoveFromGroup`, data); 
  }

//   getGroupMembers(chatRoomId: number): Observable<GroupMemberList[]> {
//     return this.http.get<GroupMemberList[]>(`${this.url}RetrieveGroupMemberByChatroomId${chatRoomId}`);
//   }
// }

