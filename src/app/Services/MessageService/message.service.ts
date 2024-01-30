import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Message } from '../../Models/Message/message';

const AddMessageUrl: string = environment.apiBaseUrl + 'Messages/AddMessage'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(formData:FormData): Observable<any>
  {
    //console.log(message);
    return this.http.post<Message>(AddMessageUrl, formData);
    
  }
}
