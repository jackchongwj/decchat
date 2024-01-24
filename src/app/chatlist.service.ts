import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development'; 

@Injectable({
  providedIn: 'root'
})
export class ChatlistService {

  private url: string = environment.apiBaseUrl+ 'Users/'

  constructor(private http: HttpClient) {}

  getChatListByUserId(userID: number): Observable<any> {
    return this.http.get(`${this.url}getChatListByUserId`,{params:{userId : userID}});
  }
} 
