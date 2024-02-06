import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment.development';
import { Friend } from '../../../Models/Friend/friend';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../../../Models/DTO/User/user-details';
import { SignalRService } from '../../SignalRService/signal-r.service';
import { User } from '../../../Models/User/user';

@Injectable({
  providedIn: 'root'
})
export class SignalRFriendService {

  constructor(private http: HttpClient, private ngZone: NgZone, private _SService: SignalRService) { }

  private hubConnection = this._SService.getHubConnection();

  // notifyFriendRequest(receiverId: number, senderId:number, profileName:string): void {
  //   if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
  //     this.hubConnection.invoke('SendFriendRequestNotification', receiverId, senderId, profileName)
  //       .then(() => console.log('notify successful'))
  //       .then(() => console.log(this.updateSearchResultsListener()))
  //       .catch(error => console.error('Error invoking SendFriendRequestNotification:', error));
  //   } else {
  //     console.error('SignalR connection is not in the "Connected" state.');
  //   }
  // }

  notifyFriendRequest(receiverId: number, senderId:number, profileName:string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendFriendRequestNotification', receiverId, senderId, profileName)
        .then(() => {
          console.log('notify successful');
          return this.updateSearchResultsListener(); 
        })
        .then(() => console.log('updateSearchResultsListener successful'))
        .catch(error => console.error('Error invoking SendFriendRequestNotification:', error));
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }

//   addFriendRequestListener(): Observable<void> {
//     return new Observable<void>(observer => {
//       if (this.hubConnection) {
//         this.hubConnection.on('ReceiveFriendRequestNotification', () => {
//           observer.next();
//         });
//         console.log("add");
//       }
//     });
//   }

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


  //accept friend request
  acceptFriendRequest(chatRoomId: number, userId: number)
  {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('acceptFriendRequest', chatRoomId, userId)
        .then(() => console.log('notify accept successful'))
        .then(() => console.log(this.updateSearchResultsListener()))
        .catch(error => console.error('Error invoking acceptFriendRequest:', error));
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }

  // private friend list

  // updatePrivateFriendList(): Observable
}
