import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { ChatRoomMessages } from '../../Models/DTO/Messages/chatroommessages';
import { TypingStatus } from '../../Models/DTO/TypingStatus/typing-status';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!:signalR.HubConnection; 
  private userId: number = parseInt(this.localStorage.getItem('userId') || '');
  https: string = environment.hubBaseUrl;

  constructor(
    private ngZone: NgZone,
    private localStorage: LocalstorageService) 
    {
      //this.buildConnection();
    }

  private buildConnection = (Id:number) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                          .configureLogging(signalR.LogLevel.Debug)
                          .withUrl(this.https+"?userId="+Id)
                          .build();
  }

  public startConnection(Id:number): Promise<void>
  {
    if(!isNaN(Id) && Id != 0)
    {
      this.buildConnection(Id);
      if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
        return this.hubConnection.start()
        .then(() => {
          console.log("id", Id);
          console.log('Connection started');
        })
        .catch(err => console.log('Error while starting connection: ' + err));
      }
      return Promise.resolve();
    }
    console.error("Invalid ID for signalR connection:", Id);
    return Promise.reject("Invalid ID");
  }

  public AddToGroup(chatlists: ChatListVM[])
  {
    console.log("list", chatlists);
    this.hubConnection.invoke("AddToGroup", chatlists, null, null)
    .then(() => console.log('AddToGroup invoked successfully'))
    .catch(err => console.log('Error while invoking "AddToGroup": ' + err));
  }

  public InformUserTyping(chatroomId:number, typing:boolean)
  {
    this.hubConnection.invoke("CheckUserTyping", chatroomId, typing)
    .catch(error => console.error('Error invoking CheckUserTyping:', error));
  }

  public UserTypingStatus():Observable<TypingStatus>
  {
    return new Observable<TypingStatus>(observer => {
      if(this.hubConnection)
      {
        //console.log("Reach FE Typing Status Listen");
        this.hubConnection.on("UserTyping", (ChatRoomId:number, isTyping:boolean) => {
          this.ngZone.run(() => {
            observer.next({ChatRoomId, isTyping});
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

  notifyMessage(newMessage: ChatRoomMessages): void {
    console.log("connect", this.hubConnection.state);
    console.log("new message", newMessage);
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessageNotification',newMessage)
        .then(() => {
          console.log('notify successful');
          return this.updateMessageListener(); 
        })
        .then(() => console.log('update Message successful'))
        .catch(error => console.error('Error invoking update message:', error));
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }
  
  
  updateMessageListener(): Observable<ChatRoomMessages> {
    return new Observable<ChatRoomMessages>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateMessage', (newMessage: ChatRoomMessages) => {
          console.log('Received new message:', newMessage); 
          this.ngZone.run(() => {
            observer.next(newMessage);
          });
        });
      }
    });
  }
  
  addNewGroupListener(): Observable<any> {
    return new Observable<any>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('NewGroupCreated', (chatListVM: ChatListVM) => {
        this.ngZone.run(() => {
          observer.next(chatListVM); // Emit the roomName to observers
        });       
        });
      }
    });
  }
}
