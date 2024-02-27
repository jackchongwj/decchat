import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { LocalstorageService } from '../LocalStorage/local-storage.service';
import { ChatRoomMessages } from '../../Models/DTO/ChatRoomMessages/chatroommessages';
import { TypingStatus } from '../../Models/DTO/TypingStatus/typing-status';
import { User } from '../../Models/User/user';

import {UserProfileUpdate} from '../../Models/DTO/UserProfileUpdate/user-profile-update';
import { GroupProfileUpdate } from '../../Models/DTO/GroupProfileUpdate/group-profile-update';

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

  public UserTypingStatus(): Observable<TypingStatus> {
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

  //searchh signalR
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
  
  //friend request signalR
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
  
  //delete friend
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

  //update private chatlist
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

  // chatlist
  retrieveChatlistListener(): Observable<ChatListVM[]> {
    return new Observable<ChatListVM[]>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('Chatlist', (newResults: ChatListVM[]) => {
          
          this.ngZone.run(() => {
            observer.next(newResults);
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
  
   removeUserListener(): Observable<{ chatRoomId: number, userId: number }> {
    return new Observable<{ chatRoomId: number, userId: number }>(observer => {
      this.hubConnection.on('UserRemoved', (chatRoomId: number, userId: number) => {
        console.log("RSR", { chatRoomId, userId })
        this.ngZone.run(() => {
          observer.next({ chatRoomId, userId });
        });
      });
    });
  }

  quitGroupListener(): Observable<{ chatRoomId: number, userId: number }> {
    return new Observable<{ chatRoomId: number, userId: number }>(observer => {
      this.hubConnection.on('QuitGroup', (chatRoomId: number, userId: number) => {
        console.log("QSR", { chatRoomId, userId })
        this.ngZone.run(() => {
          observer.next({ chatRoomId, userId });
        });
      });
    });
  }
  
  // public invokeHubMethod(methodName: string, updateInfo: any): void {
  //   if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
  //     this.hubConnection.invoke(methodName, updateInfo)
  //       .catch(error => console.error('Error invoking method on hub:', methodName, error));
  //   }
  // }
  
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



  deleteMessageListener():Observable<number>{
    return new Observable<number >( observer => {
      this.hubConnection.on("DeleteMessage", (MessageId:number) => {

        console.log("Deleted this msg: ", MessageId);
        this.ngZone.run(() => {
          observer.next(MessageId);
        });

      })
    })
  }

  editMessageListener():Observable<ChatRoomMessages>{
    return new Observable<ChatRoomMessages >( observer => {
      this.hubConnection.on("EditMessage", (EdittedMessage:ChatRoomMessages) => {

        console.log("Editted this msg: ", EdittedMessage);
        this.ngZone.run(() => {
          observer.next(EdittedMessage);
        });

      })
    })
  }

}
