import { Component, OnInit } from '@angular/core';
import { ChatListVM } from '../../../Models/DTO/ChatList/chat-list-vm';
import { DataShareService } from '../../../Services/ShareDate/data-share.service';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent implements OnInit{

  constructor(
    private _dataShareService:DataShareService){}
    
  currentChatRoom = new ChatListVM();
  imageUrl:string = "https://decchatroomb.blob.core.windows.net/chatroom/Messages/Images/2024-01-30T16:41:22-beagle.webp";
  
  ngOnInit(): void {
    this._dataShareService.selectedChatRoomData.subscribe( chatroom => {
      this.currentChatRoom = chatroom;
    });

  }
}
