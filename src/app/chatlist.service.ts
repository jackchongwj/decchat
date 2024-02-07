import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, takeLast } from 'rxjs';
import { environment } from '../environments/environment.development'; 
import { threadId } from 'node:worker_threads';

@Injectable({
  providedIn: 'root'
})
export class ChatlistService {

  private url: string = environment.apiBaseUrl+ 'Users/'

  constructor(private http: HttpClient) {}

  getChatListByUserId(userID: number): Observable<any> {
    
    return this.http.get(`${this.url}GetChatListByUserId`,{params:{userId : userID}});
  }

  RetrieveChatListByUser(userID: number): Observable<any> {
    console.log("1");
    const params = new HttpParams().set('userId', userID.toString());
    const timestamp = Date.now().toString();
    return this.http.get(`${this.url}GetChatListByUserId`,{ params });
  }
} 
