import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { ChatRoomMessages } from '../../Models/DTO/ChatRoomMessages/chatroommessages';
import { TypingStatus } from '../../Models/DTO/TypingStatus/typing-status';
import { User } from '../../Models/User/user';
import { UserProfileUpdate } from '../../Models/DTO/UserProfileUpdate/user-profile-update';
import { GroupProfileUpdate } from '../../Models/DTO/GroupProfileUpdate/group-profile-update';
import { DataShareService } from '../ShareDate/data-share.service';
import { TokenService } from '../../Services/Token/token.service';
import { LoadingService } from '../Loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  isSignalRConnected: boolean = false
  private manualDisconnect: boolean = false;
  private reconnectInterval: any;
  https: string = environment.hubBaseUrl;


  constructor(
    private ngZone: NgZone,
    private _dataShareService: DataShareService,
    private tokenService: TokenService,
    private loadingService: LoadingService
  ) {
    this.buildConnection();
  }

  private buildConnection = () => {
    const accessToken = this.tokenService.getAccessToken();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(`${this.https}?access_token=${accessToken}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.onclose((error) => {
      this.isSignalRConnected = false;
      this._dataShareService.updateSignalRConnectionStatus(this.isSignalRConnected);
      if (!this.manualDisconnect) {
        console.log("Attempting to reconnect...");
      }
    });
  }

  public startConnection(): Promise<void> {
    this.manualDisconnect = false;
    this.loadingService.show();
    this.buildConnection();

    const checkAndReconnect = async (): Promise<void> => {
      //avoid the disconnet reconnect again
      if (this.manualDisconnect && (this.hubConnection.state === signalR.HubConnectionState.Disconnecting || this.hubConnection.state === signalR.HubConnectionState.Disconnected)) {
        return;
      }

      if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await this.hubConnection.start();
          this.isSignalRConnected = true;
          this._dataShareService.updateSignalRConnectionStatus(this.isSignalRConnected);
          this.loadingService.hide();
          console.log('Connection started');
        } catch (err) {
          this.loadingService.hide();
          console.log('Error while starting connection: ' + err);
          this.isSignalRConnected = false;
          this._dataShareService.updateSignalRConnectionStatus(this.isSignalRConnected);
        }
      }
    };

    checkAndReconnect();

    this.reconnectInterval = setInterval(() => {
      checkAndReconnect();
    }, 3000);

    return Promise.resolve();
  }

  public stopConnection(): Promise<void> {
    clearInterval(this.reconnectInterval);
    this.manualDisconnect = true;  // Prevent reconnect

    // Check if the connection is in a state that allows it to be stopped.
    if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnecting) {
      return this.hubConnection.stop()
        .then(() => {
          console.log('Connection closed');
          this._dataShareService.updateSignalRConnectionStatus(false);
        })
        .catch(err => {
          console.error('Error while closing connection: ', err);
        })
        .finally(() => {
          // Reset manualDisconnect here if you want to allow reconnections in the future.
          // this.manualDisconnect = false;
        });
    } else {
      console.log('Connection is already disconnecting or disconnected.');
      return Promise.resolve(); // Resolve immediately if in an unsuitable state.
    }
  }

  public InformUserTyping(chatroomId: number, typing: boolean, profilename: string) {
    this.hubConnection.invoke("CheckUserTyping", chatroomId, typing, profilename)
      .catch(error => console.error('Error invoking CheckUserTyping:', error));
  }

  public UserTypingStatus(): Observable<TypingStatus> {
    return new Observable<TypingStatus>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on("UserTyping", (ChatRoomId: number, isTyping: boolean, currentUserProfileName: string) => {
          this.ngZone.run(() => {
            observer.next({ ChatRoomId, isTyping, currentUserProfileName });
          })
        })
      }
    })
  }

  public getHubConnection(): signalR.HubConnection {
    return this.hubConnection;
  }


  updateMessageListener(): Observable<ChatRoomMessages> {
    return new Observable<ChatRoomMessages>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateMessage', (newMessage: ChatRoomMessages) => {
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
        this.hubConnection.on('NewGroupCreated', (chatListVM: ChatListVM[]) => {
          this.ngZone.run(() => {
            observer.next(chatListVM); // Emit the roomName to observers]
          });
        });
      }
    });
  }

  addNewMemberListener(): Observable<any> {
    return new Observable<any>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UserAdded', (memberlist: ChatListVM) => {
          this.ngZone.run(() => {
            observer.next(memberlist);
          });
        });
      }
    });
  }

  removeUserListener(): Observable<{ chatRoomId: number, userId: number }> {
    return new Observable<{ chatRoomId: number, userId: number }>(observer => {
      this.hubConnection.on('UserRemoved', (chatRoomId: number, userId: number) => {
        this.ngZone.run(() => {
          observer.next({ chatRoomId, userId });
        });
      });
    });
  }

  quitGroupListener(): Observable<{ chatRoomId: number, userId: number }> {
    return new Observable<{ chatRoomId: number, userId: number }>(observer => {
      this.hubConnection.on('QuitGroup', (chatRoomId: number, userId: number) => {
        this.ngZone.run(() => {
          observer.next({ chatRoomId, userId });
        });
      });
    });
  }

  // update group initiator signalR
  updateGroupInitiatorListener(): Observable<{ chatRoomId: number, userId: number }> {
    return new Observable<{ chatRoomId: number, userId: number }>(observer => {
      this.hubConnection.on('UpdateInitiatedBy', (chatRoomId: number, userId: number) => {
        this.ngZone.run(() => {
          observer.next({ chatRoomId, userId });
        });
      });
    });
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

  userOnlineStatusListener(): Observable<{ userId: string, isOnline: boolean }> {
    return new Observable<{ userId: string, isOnline: boolean }>(observer => {
      this.hubConnection.on('UpdateUserOnlineStatus', (userId: string, isOnline: boolean) => {
        this.ngZone.run(() => {
          observer.next({ userId, isOnline });
        });
      });
    });
  }

  deleteMessageListener(): Observable<number> {
    return new Observable<number>(observer => {
      this.hubConnection.on("DeleteMessage", (MessageId: number) => {
        this.ngZone.run(() => {
          observer.next(MessageId);
        });

      })
    })
  }

  editMessageListener(): Observable<ChatRoomMessages> {
    return new Observable<ChatRoomMessages>(observer => {
      this.hubConnection.on("EditMessage", (EdittedMessage: ChatRoomMessages) => {

        this.ngZone.run(() => {
          observer.next(EdittedMessage);
        });

      })
    })
  }

  invalidFormatUpload(): Observable<number> {
    return new Observable<number>(observer => {
      this.hubConnection.on('InformWrongFormat', (senderId: number) => {
        this.ngZone.run(() => {
          observer.next(senderId);
        });
      });
    });
  }

}
