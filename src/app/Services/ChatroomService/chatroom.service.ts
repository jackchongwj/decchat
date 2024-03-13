import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../../Models/Message/message';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  private GroupUrl: string = environment.apiBaseUrl + 'Chatroom/'
  private url: string = environment.apiBaseUrl+ 'Users/'

  constructor(private http: HttpClient) { }

  updateGroupName(chatroomId: number, newGroupName: string): Observable<any> {
   
    const params = { chatroomId, newGroupName }; 
    return this.http.post(`${this.GroupUrl}UpdateGroupName`, params, { withCredentials: true });
  }
  
  updateGroupPicture(chatroomId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id', chatroomId.toString());
    const params = { formData };
    return this.http.post<any>(`${this.GroupUrl}UpdateGroupPicture`, formData, { withCredentials: true });
  }
  
}
