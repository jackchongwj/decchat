import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreategroupComponent } from '../../CreateGroup/creategroup.component';
import { Group } from '../../Models/DTO/Group/group';
import { GroupMemberList } from '../../Models/DTO/GroupMember/group-member-list';
import { AddMember } from '../../Models/DTO/AddMember/add-member';

@Injectable({
  providedIn: 'root'
})
export class ChatlistService {
  
  private url: string = environment.apiBaseUrl + 'Users/'
  private chatRoomUrl: string = environment.apiBaseUrl + 'Chatroom/';

  constructor(private http: HttpClient) { }

  createNewGroup(group: Group): Observable<any> {
    // Create data object from Group properties
    const data = {
      roomName: group.RoomName,
      SelectedUsers: group.SelectedUsers,
      InitiatedBy: group.InitiatedBy
    };
    return this.http.post(`${this.chatRoomUrl}createNewGroup`, data, { withCredentials: true }); 
  }


  addMemberToGroup(addMember: AddMember): Observable<any> {
    let params = new HttpParams().set('timestamp',new Date().toString());
    return this.http.post(`${this.chatRoomUrl}AddMembersToGroup`, addMember, { withCredentials: true });
  }

  RetrieveChatListByUser(): Observable<any> {
    let params = new HttpParams().set('timestamp',new Date().toString());

    return this.http.get(`${this.url}RetrieveChatListByUser`,{ withCredentials: true });
  }
}