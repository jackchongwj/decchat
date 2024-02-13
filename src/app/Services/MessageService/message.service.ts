import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Message } from '../../Models/Message/message';

const MessageUrl: string = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(formData:FormData): Observable<Message>
  {
    return this.http.post<Message>(`${MessageUrl}Messages/AddMessage`, formData);
  }

  retrieveChatMessages(ChatRoomId:number): Observable<any>
  {
    return this.http.get<Message>(`${MessageUrl}Messages/GetChatMessages`,{params:{ChatRoomId : ChatRoomId}})
  }

  obtainDummyData()
  {
    return[
      new Message(1,"TestRun111",3,"12:00:00","path/to/pic",1,true),
      new Message(2,"TestRun222",4,"11:00:00","path/to/pic",1,true),
      new Message(3,"TestRun333",3,"12:50:00","path/to/pic",1,true),
      new Message(4,"TestRun444",4,"13:00:00","path/to/pic",1,true),
      new Message(5,"TestRun555",5,"15:00:00","path/to/pic",1,true),
      new Message(6,"TestRun666",5,"12:01:00","path/to/pic",1,true),
      new Message(7,"TestRun777",3,"12:04:00","path/to/pic",1,true),
      new Message(8,"TestRun888",3,"14:44:00","path/to/pic",1,true),
      new Message(9,"TestRun999",4,"20:10:00","path/to/pic",1,true),
      new Message(10,"TestRun111000",6,"20:00:00","path/to/pic",1,true),
      new Message(11,"TestRun111111",4,"20:10:00","path/to/pic",1,true),
      new Message(12,"TestRun111222",6,"20:00:00","path/to/pic",1,true),
      new Message(13,"TestRun111333",4,"20:10:00","path/to/pic",1,true),
      new Message(14,"TestRun111444",6,"20:00:00","path/to/pic",1,true),
      new Message(10,"TestRun111000",6,"20:00:00","path/to/pic",1,true),
      new Message(11,"TestRun111111",4,"20:10:00","path/to/pic",1,true),
      new Message(12,"TestRun111222",6,"20:00:00","path/to/pic",1,true),
      new Message(13,"TestRun111333",4,"20:10:00","path/to/pic",1,true),
      new Message(14,"TestRun111444",6,"20:00:00","path/to/pic",1,true),
      new Message(10,"TestRun111000",6,"20:00:00","path/to/pic",1,true),
      new Message(11,"TestRun111111",4,"20:10:00","path/to/pic",1,true),
      new Message(12,"TestRun111222",6,"20:00:00","path/to/pic",1,true),
      new Message(13,"TestRun111333",4,"20:10:00","path/to/pic",1,true),
      new Message(14,"TestRun111444",6,"20:00:00","path/to/pic",1,true)

    ]
  }
}
