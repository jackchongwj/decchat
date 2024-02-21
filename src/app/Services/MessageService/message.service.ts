import { HttpClient , HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ChatRoomMessages } from '../../Models/DTO/Messages/chatroommessages';

const AddMessageUrl: string = environment.apiBaseUrl + 'Messages/AddMessage'
const MessageUrl: string = environment.apiBaseUrl + 'Messages/'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(formData:FormData): Observable<ChatRoomMessages>
  {
    console.log(AddMessageUrl);
    return this.http.post<ChatRoomMessages>(AddMessageUrl, formData, { withCredentials: true });
  }

  getMessage(ChatRoomId: number): Observable<any>
  {
    const params = new HttpParams().set('ChatRoomId', ChatRoomId);
    return this.http.get(`${MessageUrl}GetMessage`, {params})
  }


}
