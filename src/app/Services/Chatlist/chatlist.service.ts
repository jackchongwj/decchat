import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development'; 
import { CreategroupComponent } from '../../CreateGroup/creategroup.component';
import { Group } from '../../Models/DTO/Group/group';

@Injectable({
  providedIn: 'root'
})
export class ChatlistService {

  private url: string = environment.apiBaseUrl+ 'Users/'
  private chatRoomUrl: string = environment.apiBaseUrl + 'Chatroom/';

  constructor(private http: HttpClient) {}

  getChatListByUserId(userid: number): Observable<any> {
    // Construct HttpParams object with userId parameter
    const params = new HttpParams().set('userId', userid);

    // Use params object in the request
    return this.http.get(`${this.url}getChatListByUserId`, { params: params });
  }

  createNewGroup(group: Group): Observable<any> {
    // Create data object from Group properties
    const data = {
      roomName: group.RoomName,
      SelectedUsers: group.SelectedUsers,
      InitiatedBy: group.InitiatedBy
    };
    return this.http.post(`${this.chatRoomUrl}createNewGroup`, data);
  }

  RetrieveChatListByUser(userID: number): Observable<any> {
    const params = new HttpParams().set('userId', userID.toString());
    return this.http.get(`${this.url}RetrieveChatListByUser`,{ params });
  }
}
