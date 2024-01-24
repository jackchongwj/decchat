import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../environments/environment.development';
import { Friend } from '../../../Models/Friend/friend';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../../../Models/DTO/User/user-details';

@Injectable({
  providedIn: 'root'
})
export class SignalRFriendService {

  private hubConnection: signalR.HubConnection | undefined;
  private url: string = environment.signalRUrl + 'chatHub';


  constructor(private http: HttpClient, private ngZone: NgZone) { }

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();

    this.hubConnection.start()
    .then(() => {
      console.log('SignalR connection started');
      
    })
      .catch(err => console.error('Error while starting SignalR connection: ' + err));

      this.hubConnection.onclose(error => {
        console.error('SignalR connection closed:', error);
      });
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch(err => console.error('Error while stopping SignalR connection: ' + err));
    }
  }

  notifyFriendRequest(receiverId: number, senderId:number, profileName:string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendFriendRequestNotification', receiverId, senderId, profileName)
        .then(() => console.log('notify successful'))
        .then(() => console.log(this.updateSearchResultsListener()))
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

  updateSearchResultsListener(): Observable<UserDetails[]> {
    return new Observable<UserDetails[]>(observer => {
      if (this.hubConnection) {
        this.hubConnection.on('UpdateSearchResults', (newResults: UserDetails[]) => {
          console.log('Received new search results:', newResults); 
          this.ngZone.run(() => {
            observer.next(newResults);
          });
        });
      }
    });
  }
}
