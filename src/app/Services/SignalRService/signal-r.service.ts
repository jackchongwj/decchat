import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';

interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!:signalR.HubConnection 
  userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  constructor(private ngZone: NgZone) {
    this.buildConnection();
   }

   https: string = environment.signalRUrl;

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                          .configureLogging(signalR.LogLevel.Debug)
                          .withUrl(this.https+"?userId="+this.userId)
                          .build();
  }

  public startConnection(list: ChatListVM[]): Promise<void>
  {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection.start()
      .then(() => {
        console.log("id",this.userId);
        console.log('Connection started');
        return this.hubConnection.invoke("AddToGroup", list)
          .then(() => console.log('AddToGroup invoked successfully'))
          .catch(err => console.log('Error while invoking "AddToGroup": ' + err));
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }
    return Promise.resolve();
  }

  public InformUserTyping(name:string, typing:boolean)
  {
    this.hubConnection.invoke("CheckUserTyping", name, typing)
    //.then(() => console.log(''))
    .catch(error => console.error('Error invoking CheckUserTyping:', error));
  }

  public UserTypingStatus():Observable<TypingStatus>
  {
    return new Observable<TypingStatus>(observer => {
      if(this.hubConnection)
      {
        this.hubConnection.on("UserTyping", (userName:string, isTyping:boolean) => {
          this.ngZone.run(() => {
            observer.next({ userName, isTyping });
          })
        })
      }
    })
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection.stop()
    .then(() => console.log('SignalR connection closed'))
    .catch(err => console.error('Error while closing connection'));
  }

  public getHubConnection(): signalR.HubConnection
  {
    return this.hubConnection;
  }
}
