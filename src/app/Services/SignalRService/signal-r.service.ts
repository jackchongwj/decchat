import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!:signalR.HubConnection 

  constructor() {
    this.buildConnection();
   }

   https: string = environment.signalRUrl;
   //http: string = 'http://localhost:5034/chatHub';
   //IIS: string = 'https://localhost:44363/chatHub';

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                          .withUrl(this.https) // Use your server URL
                          .build();
  }

  public startConnection(): Promise<void>
  {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));;
    }
    return Promise.resolve();
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('ReceiveMessage', (data) => {
      console.log(data);
    });
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection.stop()
    .then(() => console.log('SignalR connection closed'))
    .catch(err => console.error('Error while closing connection'));
  }
}
