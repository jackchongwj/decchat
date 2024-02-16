import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { Message } from '../../Models/Message/message';
import { Messages } from '../../Models/DTO/Messages/messages';

interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!:signalR.HubConnection; 
    
  // userId: number = parseInt(localStorage.getItem('userId') || '', 10);
  constructor(private ngZone: NgZone,  private localStorage: LocalstorageService) {
    this.buildConnection();
   }

   private userId: number = parseInt(this.localStorage.getItem('userId') || '');
   https: string = environment.signalRUrl;

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                          .configureLogging(signalR.LogLevel.Debug)
                          .withUrl(this.https+"?userId="+this.userId)
                          .build();
  }

  public startConnection(): Promise<void>
  {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection.start()
      .then(() => {
        console.log("id",this.userId);
        console.log('Connection started');
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }
    return Promise.resolve();
  }

  public AddToGroup(chatlists: ChatListVM[])
  {
    console.log("list", chatlists);
    this.hubConnection.invoke("AddToGroup", chatlists, null, null)
    .then(() => console.log('AddToGroup invoked successfully'))
    .catch(err => console.log('Error while invoking "AddToGroup": ' + err));
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

  notifyMessage(newMessage: Messages): void {
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
  
 
  updateMessageListener(): Observable<Messages[]> {
    return new Observable<Messages[]>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateMessage', (newMessage: Messages[]) => {
          console.log('Received new message:', newMessage); 
          this.ngZone.run(() => {
            observer.next(newMessage);
          });
        });
      }
    });
  }


  // addNewGroupListener(): Observable<any> {
  //   return new Observable<any>(observer => {
  //     if (this.hubConnection) {
  //       this.hubConnection.on('NewGroupCreated', (roomName: string) => {
  //         console.log('New group created: ', roomName);
  //         observer.next(roomName); // Emit the roomName to observers
  //       });
  //     }
  //   });
  //   }

  //   this.hubConnection.on('NewGroupCreated', (roomName: string) => {
  //     console.log('New group created: ', roomName);
  //     // Handle the new group creation event (e.g., update UI)
  //   });
  // }

  //  // good good Method to create a new group and notify the server
  //  createNewGroup(roomName: string, initiatedBy: number, selectedUsers: number[]): void {
  //   // Invoke the server method to create a new group
  //   this.hubConnection.invoke('CreateGroup', roomName, initiatedBy, selectedUsers)

  //   .then(() => {
  //     console.log('Group created successful');
  //     return this.addNewGroupListener(); 
  //   })
  //     .catch(err => console.error(err));
    
  // }



  // addNewGroupListener(callback: (groupChat: any) => void) {
  //   this.hubConnection.on('NewGroupCreated', (groupChat: any) => {
  //     callback(groupChat);
  //   });
  // }

  //  // Method to listen for group created events
  //  groupCreated(): Observable<groupChat[]> {
  //   const subject = new Subject<groupChat[]>();
  //   this.hubConnection.on('GroupCreated', (data: GroupCregroupChat[]) => {
  //       subject.next(data);
  //   });
  //   return subject.asObservable();
  // }
  // createNewGroup(roomName: string, initiatedBy: number, selectedUsers: number[]): Observable<any> {
  //   return new Observable<any>(observer => {
  //     this.hubConnection.invoke('CreateGroup', roomName, initiatedBy, selectedUsers)
  //       .then(() => {
  //         console.log('Group creation request sent');
  //       })
  //       .catch(err => {
  //         console.error('Error creating group:', err);
  //         observer.error(err); // Emit error if encountered
  //       });
  //   });
  // }
  
  addNewGroupListener(): Observable<any> {
    return new Observable<any>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('NewGroupCreated', (chatListVM: ChatListVM) => {
          // console.log('New group created:', roomName);
          // observer.next(roomName); // Emit the roomName to observers
        //pass to roomtype in chatlist
        this.ngZone.run(() => {
          observer.next(chatListVM); // Emit the roomName to observers
        });
        
        });
      }
    });
  }
}
