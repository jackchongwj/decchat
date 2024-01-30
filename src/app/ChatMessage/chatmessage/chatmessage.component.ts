import { Component, NgZone } from '@angular/core';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-chatmessage',
  templateUrl: './chatmessage.component.html',
  styleUrl: './chatmessage.component.css'
})
export class ChatmessageComponent {

  constructor(){}

  imageUrl: string = 'https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-29T11:42:23-beagle.png';

  ngOnInit(){
  }
}
