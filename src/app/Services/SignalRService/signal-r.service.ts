import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { ChatRoomMessages } from '../../Models/DTO/Messages/chatroommessages';
import { TypingStatus } from '../../Models/DTO/TypingStatus/typing-status';
import { User } from '../../Models/User/user';
import {UserProfileUpdate} from '../../Models/DTO/UserProfileUpdate';
import { GroupProfileUpdate } from '../../Models/DTO/GroupProfileUpdate';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  // userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  constructor(private ngZone: NgZone, private localStorage: LocalstorageService) {
    this.buildConnection();
  }

  private userId: number = parseInt(this.localStorage.getItem('userId') || '');
  https: string = environment.signalRUrl;

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(this.https + "?userId=" + this.userId)
      .build();
  }

  public startConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection.start()
        .then(() => {
          console.log("id", this.userId);
          console.log('Connection started');
        })
        .catch(err => console.log('Error while starting connection: ' + err));
    }
    return Promise.resolve();
  }

  public AddToGroup(chatlists: ChatListVM[]) {
    console.log("list", chatlists);
    this.hubConnection.invoke("AddToGroup", chatlists, null, null)
      .then(() => console.log('AddToGroup invoked successfully'))
      .catch(err => console.log('Error while invoking "AddToGroup": ' + err));
  }

  public InformUserTyping(chatroomId: number, typing: boolean) {
    this.hubConnection.invoke("CheckUserTyping", chatroomId, typing)
      //.then(() => console.log(''))
      .catch(error => console.error('Error invoking CheckUserTyping:', error));
  }

  public UserTypingStatus(): Observable<TypingStatus> {
    return new Observable<TypingStatus>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on("UserTyping", (ChatRoomId: number, isTyping: boolean) => {
          this.ngZone.run(() => {
            observer.next({ ChatRoomId, isTyping });
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

  public getHubConnection(): signalR.HubConnection {
    return this.hubConnection;
  }

  notifyMessage(newMessage: ChatRoomMessages): void {
    console.log("connect", this.hubConnection.state);
    console.log("new message", newMessage);
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessageNotification', newMessage)
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


  updateMessageListener(): Observable<ChatRoomMessages[]> {
    return new Observable<ChatRoomMessages[]>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateMessage', (newMessage: ChatRoomMessages[]) => {
          console.log('Received new message:', newMessage);
          this.ngZone.run(() => {
            observer.next(newMessage);
          });
        });
      }
    });
  }

  public invokeHubMethod(methodName: string, updateInfo: any): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke(methodName, updateInfo)
        .catch(error => console.error('Error invoking method on hub:', methodName, error));
    }
  }
  
  public profileUpdateListener(): Observable<UserProfileUpdate> {
    return new Observable<UserProfileUpdate>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('ReceiveUserProfileUpdate', (updateInfo: UserProfileUpdate) => {
          this.ngZone.run(() => {
            observer.next(updateInfo);
          });
        });
      }
    });
  }

  public groupUpdateListener(): Observable<GroupProfileUpdate> {
    return new Observable<GroupProfileUpdate>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('ReceiveGroupProfileUpdate', (updateInfo: GroupProfileUpdate) => {
          this.ngZone.run(() => {
            observer.next(updateInfo);
          });
        });
      }
    });
  }


}
