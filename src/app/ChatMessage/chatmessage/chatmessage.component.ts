import { Component, NgZone, OnInit } from '@angular/core';
import { ChatListVM } from '../../Models/DTO/ChatList/chat-list-vm';
import { Message } from '../../Models/Message/message';
import { Messages } from '../../Models/DTO/Messages/messages';
import { MessageService } from '../../Services/MessageService/message.service';
import { DataShareService } from '../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../Services/SignalRService/signal-r.service';

interface TypingStatus{
  userName:string;
  isTyping:boolean;
}

@Component({
  selector: 'app-chatmessage',
  templateUrl: './chatmessage.component.html',
  styleUrl: './chatmessage.component.css'
})
export class ChatmessageComponent implements OnInit {

  constructor(
    private _dataShareService:DataShareService,
    private _messageService:MessageService,
    private _signalRService:SignalRService){}

  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  currentChatRoom = new ChatListVM();
  messageList : Messages[] = [];
  isTyping: boolean = false;

  ngOnInit(){
    // this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
    //   this.currentChatRoom = chatroom;
    // });

    // this._dataShareService.UserTyping.subscribe( typingStatus => {
    //   this.isTyping = typingStatus;
    // });

    // this.messageList = this._messageService.obtainDummyData();

    // this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
    //   this.isTyping = status.isTyping;
    // });
  }

}
