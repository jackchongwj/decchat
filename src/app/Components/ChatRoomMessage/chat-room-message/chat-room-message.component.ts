import { Component, OnInit } from '@angular/core';
import { Message } from '../../../Models/Message/message';
import { MessageService } from '../../../Services/MessageService/message.service';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Component({
  selector: 'app-chat-room-message',
  templateUrl: './chat-room-message.component.html',
  styleUrl: './chat-room-message.component.css'
})
export class ChatRoomMessageComponent implements OnInit{

  constructor(
    private _dataShareService:DataShareService,
    private _messageService:MessageService,
    private _signalRService:SignalRService
  ){}
    
  messageList : Message[] = [];
  isTyping: boolean = false;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";

  ngOnInit(){
    this._dataShareService.UserTyping.subscribe( typingStatus => {
      this.isTyping = typingStatus;
    });
    console.log("Received message list");
    this.messageList = this._messageService.obtainDummyData();

    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      this.isTyping = status.isTyping;
    });


  }

}
