import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { ChatRoomMessages } from '../../Models/DTO/Messages/chatroommessages';
import { TypingStatus } from '../../Models/DTO/TypingStatus/typing-status';
import { User } from '../../Models/User/user';

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
          console.log('Connection started');
        })
        .catch(err => console.log('Error while starting connection: ' + err));
      }
      return Promise.resolve();
    }
    console.error("Invalid ID for signalR connection:", Id);
    return Promise.reject("Invalid ID");
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection.stop()
    .then(() => console.log('SignalR connection closed'))
    .catch(err => console.error('Error while closing connection'));
  }

  public InformUserTyping(chatroomId:number, typing:boolean, profilename:string)
  {
    this.hubConnection.invoke("CheckUserTyping", chatroomId, typing, profilename)
    .catch(error => console.error('Error invoking CheckUserTyping:', error));
  }

  public UserTypingStatus():Observable<TypingStatus>
  {
    return new Observable<TypingStatus>(observer => {
      if(this.hubConnection)
      {
        this.hubConnection.on("UserTyping", (ChatRoomId:number, isTyping:boolean, currentUserProfileName:string) => {
          this.ngZone.run(() => {
            observer.next({ChatRoomId, isTyping, currentUserProfileName});
          })
        })
      }
    })
  }

  public getHubConnection(): signalR.HubConnection
  {
    return this.hubConnection;
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

  updateSearchResultsListener(): Observable<number> {
    return new Observable<number>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateSearchResults', (userId: number) => {
          console.log('Received new search results:', userId); 
          this.ngZone.run(() => {
            observer.next(userId);
          });
        });
      }
    });
  } 
  

  updateFriendRequestListener(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateFriendRequest', (newResults: User[]) => {
          console.log('Received new Friend Request results:', newResults); 
          this.ngZone.run(() => {
            observer.next(newResults);
          });
        });
      }
    });
  }

  updateSearchResultsAfterAccept(): Observable<number> {
    return new Observable<number>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateSearchResultsAfterAccept', (userId: number) => {
          console.log('Received new search results After Accept:', userId); 
          this.ngZone.run(() => {
            observer.next(userId);
          });
        });
      }
    });
  }


  updateSearchResultsAfterReject(): Observable<number> {
    return new Observable<number>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateSearchResultsAfterReject', (userId: number) => {
          console.log('Received new search results After Reject:', userId); 
          this.ngZone.run(() => {
            observer.next(userId);
          });
        });
      }
    });
  }

  updatePrivateChatlist(): Observable<ChatListVM> {
    return new Observable<ChatListVM>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdatePrivateChatlist', (chatlist: ChatListVM) => {
          console.log('Received new private chatlist:', chatlist); 
          this.ngZone.run(() => {
            observer.next(chatlist);
          });
        });
      }
    });
  }

  DelteFriend(): Observable<number> {
    return new Observable<number>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('DeleteFriend', (userId: number) => {
          console.log('Delete Friend Successfull:', userId); 
          this.ngZone.run(() => {
            observer.next(userId);
          });
        });
      }
    });
  }
}
