import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatRoomMessages } from '../../Models/DTO/ChatRoomMessages/chatroommessages';
import { EditMessage } from '../../Models/DTO/EditMessage/edit-message';

const MessageUrl: string = environment.apiBaseUrl + 'Messages/'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(formData:FormData): Observable<ChatRoomMessages>
  {
    return this.http.post<ChatRoomMessages>(`${MessageUrl}AddMessage`, formData, { withCredentials: true });
  }

  getMessage(ChatRoomId: number, MessageId: number, forceRefresh:boolean = false): Observable<any>
  {
    let params = new HttpParams().set('ChatRoomId', ChatRoomId).set('MessageId', MessageId);
    if (forceRefresh) {
      // Append a timestamp or a random value to force a fresh fetch
      params = params.append('t', new Date().getTime().toString());
    }
    
    return this.http.get(`${MessageUrl}GetMessage`, { params, withCredentials: true })
  }

  editMessage(EdittedMessage:EditMessage): Observable<any>{
    return this.http.post<EditMessage>(`${MessageUrl}EditMessage`, EdittedMessage);
  }

  deleteMessage(MessageId:number, ChatRoomId:number): Observable<any> {
    const params = new HttpParams()
      .set('MessageId', MessageId.toString())
      .set('ChatRoomId', ChatRoomId.toString());
  
    return this.http.post<number>(`${MessageUrl}DeleteMessage`, null, {
      params: params,
      withCredentials: true
    });
  }

  getSearch(ChatRoomId: Number, searchValue: string): Observable<any> {
    const params = new HttpParams().set('ChatRoomId', ChatRoomId.toString()).set('searchValue',searchValue);
    return this.http.get(`${MessageUrl}GetTotalSearchMessage`, {params})
  }
  
}
