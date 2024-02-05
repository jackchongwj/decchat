import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!:signalR.HubConnection 

  constructor(private ngZone: NgZone) {
    this.buildConnection();
   }

   https: string = environment.signalRUrl;

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                          .withUrl(this.https) // Use your server URL
                          .build();
  }

  public startConnection(list: ChatListVM[]): Promise<void>
  {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
    
        return this.hubConnection.invoke("AddToGroup", list)
          .then(() => console.log('AddToGroup invoked successfully'))
          .catch(err => console.log('Error while invoking "AddToGroup": ' + err));
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }
    return Promise.resolve();
  }

  public sendMessageToOtherUser(message:string)
  {
    this.hubConnection.invoke("ReceiveIncomingMessage", message)
    .then(() => console.log('Message Sent Successfully'))
    .catch(error => console.error('Error invoking ReceiveIncomingMessage:', error));
  }

  public listenMessage():Observable<string>
  {
    return new Observable<string>(observer => {
      if(this.hubConnection)
      {
        this.hubConnection.on("ReceiveMessage", (message:string) => {
          console.log("Someone: ",message);
          this.ngZone.run(() => {
            observer.next(message);
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
