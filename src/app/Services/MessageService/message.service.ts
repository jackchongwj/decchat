import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Message } from '../../Models/Message/message';

const MessageUrl: string = environment.apiBaseUrl + 'Messages/'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(message: Message): Observable<any>
  {
    //console.log(message);
    return this.http.post<Message>('https://localhost:7184/api/Messages/AddMessage', message)
  }
}
