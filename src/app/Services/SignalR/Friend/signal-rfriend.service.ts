import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment.development';
import { Friend } from '../../../Models/Friend/friend';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserSearchDetails } from '../../../Models/DTO/User/user-search-details';
import { SignalRService } from '../../SignalRService/signal-r.service';
import { User } from '../../../Models/User/user';

@Injectable({
  providedIn: 'root'
})
export class SignalRFriendService {

  constructor(private http: HttpClient, private ngZone: NgZone, private _SService: SignalRService) { }

  private hubConnection = this._SService.getHubConnection();

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

  acceptFriendRequest(chatRoomId: number, userId: number, receiverId: number)
  {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('acceptFriendRequest', chatRoomId, userId, receiverId)
        .then(() => console.log('notify accept successful'))
        .catch(error => console.error('Error invoking acceptFriendRequest:', error));
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }


  //reject friend request
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
  

  rejectFriendRequest(userId: number, receiverId: number)
  {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('rejectFriendRequest', userId, receiverId)
        .then(() => console.log('notify reject successful'))
        .catch(error => console.error('Error invoking rejectFriendRequest:', error));
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }
}
