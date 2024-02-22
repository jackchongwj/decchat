import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../../Models/Message/message';
import { catchError, map, Observable, throwError } from 'rxjs';


const GroupUrl: string = environment.apiBaseUrl + 'Chatroom/'

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  private url: string = environment.apiBaseUrl+ 'Users/'

  constructor(private http: HttpClient) { }

  // getGroupById(chatroomId: number): Observable<any> {
  //   const params = new HttpParams().set('id',chatroomId.toString());
  //   return this.http.get(`${GroupUrl}GroupDetails`, {params});
  // }

  updateGroupName(chatroomId: number, newGroupName: string): Observable<any> {
   
    const params = { chatroomId, newGroupName }; 
    return this.http.post(`${GroupUrl}UpdateGroupName`, params);
  }
  
  updateGroupPicture(chatroomId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id', chatroomId.toString());
    const params = { formData };
    return this.http.post<any>(`${GroupUrl}UpdateGroupPicture`, formData);
  }
  
}
