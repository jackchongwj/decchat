import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { TypingStatus } from '../../../Models/DTO/TypingStatus/typing-status';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';
import { SignalRService } from '../../../Services/SignalRService/signal-r.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent implements OnInit{

  constructor(
    private _dataShareService:DataShareService,
    private _signalRService:SignalRService
    ){}
    
  currentChatRoom = {} as ChatListVM;
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  IsCurrentChatUser: boolean = false;

  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
      this.IsCurrentChatUser = false;
    });

    this._signalRService.UserTypingStatus().subscribe((status:TypingStatus) => {
      if(status.isTyping && status.ChatRoomId == this.currentChatRoom.ChatRoomId)
      {
        this.IsCurrentChatUser = true;
      }
      else{
        this.IsCurrentChatUser = false;
      }
    });
  }

}
