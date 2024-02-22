import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../Models/Message/message';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  private url: string = environment.apiBaseUrl+ 'Users/'

  constructor(private http: HttpClient) { }

  
}
